import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import tokenGenerator from '../utils/tokenGenerator.js';
import emailService from '../services/email.service.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification token
        const { token: verificationToken, expiry: verificationExpiry } =
            tokenGenerator.generateEmailVerificationToken();

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: 'CUSTOMER',
                emailVerifyToken: verificationToken,
                emailVerifyExpiry: verificationExpiry,
                emailVerified: false,
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                role: true,
                createdAt: true,
            },
        });

        // Send verification email (don't await - run in background)
        emailService.sendVerificationEmail(user, verificationToken).catch(err =>
            console.error('Verification email failed:', err.message)
        );

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                city: true,
                zip: true,
                role: true,
                createdAt: true,
            },
        });

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, city, zip } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                phone,
                address,
                city,
                zip,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                city: true,
                zip: true,
                role: true,
                createdAt: true,
            },
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// ============ EMAIL VERIFICATION ============

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new AppError('Verification token is required', 400);
        }

        // Find user with this token
        const user = await prisma.user.findFirst({
            where: {
                emailVerifyToken: token,
            },
        });

        if (!user) {
            throw new AppError('Invalid or expired verification token', 400);
        }

        // Check if token is expired
        if (!tokenGenerator.isTokenValid(user.emailVerifyExpiry)) {
            throw new AppError('Verification token has expired. Please request a new one.', 400);
        }

        // Update user - mark as verified and clear token
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerifyToken: null,
                emailVerifyExpiry: null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                role: true,
            },
        });

        res.json({
            success: true,
            message: 'Email verified successfully! You can now use all features.',
            data: { user: updatedUser },
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400);
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if already verified
        if (user.emailVerified) {
            throw new AppError('Email is already verified', 400);
        }

        // Generate new token
        const { token, expiry } = tokenGenerator.generateEmailVerificationToken();

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerifyToken: token,
                emailVerifyExpiry: expiry,
            },
        });

        // Send verification email
        await emailService.sendVerificationEmail(user, token);

        res.json({
            success: true,
            message: 'Verification email sent! Please check your inbox.',
        });
    } catch (error) {
        next(error);
    }
};

// ============ PASSWORD RESET ============

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400);
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Don't reveal if user exists or not (security)
        if (!user) {
            return res.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Generate reset token
        const { token, expiry } = tokenGenerator.generatePasswordResetToken();

        // Update user with reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetExpiry: expiry,
            },
        });

        // Send password reset email
        await emailService.sendPasswordResetEmail(user, token);

        res.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new AppError('Token and new password are required', 400);
        }

        // Validate password strength
        if (newPassword.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }

        // Find user with this token
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
            },
        });

        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        // Check if token is expired
        if (!tokenGenerator.isTokenValid(user.passwordResetExpiry)) {
            throw new AppError('Reset token has expired. Please request a new one.', 400);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user - set new password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiry: null,
            },
        });

        res.json({
            success: true,
            message: 'Password reset successfully! You can now login with your new password.',
        });
    } catch (error) {
        next(error);
    }
};
