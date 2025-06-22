const { Order, User, Cart } = require('../models');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const cart = await Cart.findOne({ where: { userId } });
        
        let cartItems = cart ? cart.items : [];
        if (typeof cartItems === 'string') {
             try { cartItems = JSON.parse(cartItems); } catch(e) { cartItems = []; }
        }
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + (item.scrap.pricePerKg * item.quantity), 0);

        const order = await Order.create({
            userId: user.id,
            username: user.username,
            items: cartItems,
            totalPrice,
            timestamp: new Date().toISOString(),
            status: 'pending',
            zipCode: user.zipCode,
        });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(201).json(order);

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        if (req.user.type !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Only for vendors.' });
        }
        
        const vendor = await User.findByPk(req.user.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found.'});
        }

        const orders = await Order.findAll({ 
            where: { 
                zipCode: vendor.zipCode,
                status: 'pending'
            },
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['evmAddress', 'solanaAddress']
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        if (req.user.type !== 'user') {
             return res.status(403).json({ message: 'Access denied.' });
        }
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};