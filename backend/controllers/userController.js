const { User } = require('../models');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateMe = async (req, res) => {
    try {
        const { evmAddress, solanaAddress } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.evmAddress = evmAddress;
        user.solanaAddress = solanaAddress;
        
        await user.save();

        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.json(updatedUser);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'That wallet address is already in use.' });
        }
        console.error('Update Me Error:', error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};