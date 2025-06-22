const { Cart } = require('../models');

const getOrCreateCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }
        req.cart = cart;
        next();
    } catch (error) {
        console.error('Cart middleware error:', error);
        res.status(500).json({ message: 'Server error processing cart' });
    }
};

exports.getCart = async (req, res) => {
    res.json(req.cart);
};

exports.addToCart = async (req, res) => {
    try {
        const { cart } = req;
        const { item } = req.body;

        if (!item || !item.scrap || typeof item.quantity === 'undefined') {
            return res.status(400).json({ message: 'Invalid item data provided' });
        }
        
        const currentItems = Array.isArray(cart.items) ? cart.items : [];
        const existingItemIndex = currentItems.findIndex(ci => ci.scrap.id === item.scrap.id);

        let newItems;

        if (existingItemIndex > -1) {
            newItems = currentItems.map((currentItem, index) => {
                if (index === existingItemIndex) {
                    return {
                        ...currentItem,
                        quantity: currentItem.quantity + item.quantity,
                    };
                }
                return currentItem;
            });
        } else {
            newItems = [...currentItems, item];
        }
        
        cart.items = newItems;
        
        cart.changed('items', true);

        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { cart } = req;
        const { scrapId } = req.body;
        
        if (!scrapId) {
            return res.status(400).json({ message: 'Scrap ID is required.' });
        }

        const currentItems = Array.isArray(cart.items) ? cart.items : [];
        cart.items = currentItems.filter(item => item.scrap.id !== scrapId);
        cart.changed('items', true);
        
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { cart } = req;
        cart.items = []; 
        cart.changed('items', true);
        await cart.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrCreateCart = getOrCreateCart;