import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler.js';
import emailService from '../services/email.service.js';

/**
 * Get all users with pagination
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const where = {
            role: 'CUSTOMER',
            ...(search && {
                OR: [
                    { email: { contains: search } },
                    { name: { contains: search } },
                    { phone: { contains: search } },
                ],
            }),
        };

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                    city: true,
                    zip: true,
                    emailVerified: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID with order history
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                city: true,
                zip: true,
                emailVerified: true,
                role: true,
                createdAt: true,
                orders: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Don't allow deleting admin users
        if (user.role === 'ADMIN') {
            throw new AppError('Cannot delete admin users', 403);
        }

        // Delete user (orders will be set to null due to onDelete: SetNull)
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset user password (send reset email)
 */
export const resetUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Update user with reset token
        await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                passwordResetToken: hashedToken,
                passwordResetExpiry: resetExpiry,
            },
        });

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;

        try {
            await emailService.sendEmail({
                to: user.email,
                subject: 'Password Reset Request - Fruitify',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a34a;">Password Reset Request</h2>
                        <p>Hello ${user.name || 'User'},</p>
                        <p>An administrator has requested a password reset for your account. Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                        </div>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <p>Best regards,<br>The Fruitify Team</p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Error sending reset email:', emailError);
            // Continue even if email fails
        }

        res.json({
            success: true,
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};
