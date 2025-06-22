const { User, PasswordResetToken } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/SendEmail'); 
const config = require('../config');
const { Op } = require('sequelize');

exports.signup = async (req, res) => {
    const { 
        role, email, password, confirmPassword, 
        firstName, lastName, businessName, username, phone,
        streetAddress, city, state, zipCode 
    } = req.body;

    if (!['user', 'vendor'].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
    }
    if (!streetAddress || !city || !state || !zipCode) {
        return res.status(400).json({ message: "Full address including ZIP code is required." });
    }

    try {
        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            role, email, username, password: hashedPassword, phone,
            streetAddress, city, state, zipCode,
            firstName: role === 'user' ? firstName : null,
            businessName: role === 'vendor' ? businessName : null,
            lastName: role === 'user' ? lastName : null,
        };

        const user = await User.create(userData);

        const verificationToken = jwt.sign({ id: user.id, type: user.role }, config.JWT_SECRET, { expiresIn: '1h' });
        const link = `${config.BASE_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, 'Verify Your Email', `<p>Click <a href="${link}">here</a> to verify your email.</p>`);

        res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} created. Please check your email to verify your account.` });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            where: { [Op.or]: [{ email: identifier }, { username: identifier }] }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified. Please check your inbox.' });
        }

        const token = jwt.sign({ id: user.id, type: user.role }, config.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            id: user.id,
            username: user.username,
            email: user.email,
            type: user.role,
            businessName: user.businessName,
            address: user.address,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = true;
        await user.save();
        res.json({ message: 'Email verified successfully. You can now log in.' });

    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.forgotResetPassword = async (req, res) => {
    const { email, token, newPassword, confirmNewPassword } = req.body;

    try {
        if (email) {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                console.log("Password reset attempt for non-existent user:", email);
                return res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
            }

            const resetTokenValue = uuidv4();
            await PasswordResetToken.create({
                token: resetTokenValue,
                userId: user.id,
                expiresAt: new Date(Date.now() + 3600000),
            });

            const resetLink = `${config.BASE_URL}/reset-password?token=${resetTokenValue}`;
            await sendEmail(user.email, 'Password Reset', `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);

            return res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        if (token && newPassword) {
            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: "New passwords don't match" });
            }

            const resetToken = await PasswordResetToken.findOne({
                where: { token, expiresAt: { [Op.gt]: new Date() } }
            });

            if (!resetToken) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            const user = await User.findByPk(resetToken.userId);
            if (!user) {
                 return res.status(400).json({ message: 'User associated with token not found.' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            await resetToken.destroy();

            return res.json({ message: 'Password has been reset successfully' });
        }
        
        return res.status(400).json({ message: 'Invalid request' });
    } catch (error) {
        console.error("Password Reset Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};