import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, orderType = 'RETAIL') => {
        setCart((prevCart) => {
            // Check if product already exists in cart with same order type
            const existingItemIndex = prevCart.findIndex(
                (item) => item.product.id === product.id && item.orderType === orderType
            );

            if (existingItemIndex > -1) {
                // Update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                toast.success('Updated cart quantity');
                return newCart;
            } else {
                // Add new item
                toast.success('Added to cart!');
                return [...prevCart, { product, quantity, orderType }];
            }
        });
    };

    const removeFromCart = (productId, orderType) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item.product.id === productId && item.orderType === orderType)
            )
        );
        toast.success('Removed from cart');
    };

    const updateQuantity = (productId, orderType, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, orderType);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product.id === productId && item.orderType === orderType
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.success('Cart cleared');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price =
                item.orderType === 'WHOLESALE'
                    ? parseFloat(item.product.wholesalePrice)
                    : parseFloat(item.product.retailPrice);
            return total + price * item.quantity;
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
