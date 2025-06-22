const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-reset-password', authController.forgotResetPassword);

router.get('/verify-email', authController.verifyEmail);

router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    res.redirect(`http://localhost:3000/reset-password?token=${token}`); 
});

module.exports = router;