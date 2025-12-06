import crypto from 'crypto';

/**
 * Token Generator Utility
 * Generates secure random tokens for email verification and password reset
 */

class TokenGenerator {
    /**
     * Generate a secure random token
     * @param {number} length - Token length in bytes (default: 32)
     * @returns {string} - Hex string token
     */
    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate email verification token with expiry
     * @returns {Object} - { token, expiry }
     */
    generateEmailVerificationToken() {
        const token = this.generateToken(32);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24); // 24 hours validity

        return {
            token,
            expiry,
        };
    }

    /**
     * Generate password reset token with expiry
     * @returns {Object} - { token, expiry }
     */
    generatePasswordResetToken() {
        const token = this.generateToken(32);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // 1 hour validity

        return {
            token,
            expiry,
        };
    }

    /**
     * Validate if token is still valid (not expired)
     * @param {Date} expiry - Token expiry date
     * @returns {boolean} - True if valid, false if expired
     */
    isTokenValid(expiry) {
        if (!expiry) return false;
        return new Date() < new Date(expiry);
    }

    /**
     * Hash a token for secure storage (optional, for extra security)
     * @param {string} token - Token to hash
     * @returns {string} - Hashed token
     */
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}

export default new TokenGenerator();
