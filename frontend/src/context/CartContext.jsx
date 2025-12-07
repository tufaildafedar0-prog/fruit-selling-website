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

    // NEW: Updated to handle variants
    const addToCart = (product, quantity = 1, orderType = 'RETAIL', variant = null) => {
        setCart((prevCart) => {
            // NEW: Create unique item key including variant
            const variantId = variant?.id || null;

            // Check if product with same variant already exists in cart
            const existingItemIndex = prevCart.findIndex(
                (item) =>
                    item.product.id === product.id &&
                    item.orderType === orderType &&
                    item.variant?.id === variantId // NEW: Match variant too
            );

            if (existingItemIndex > -1) {
                // Update quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                toast.success('Updated cart quantity');
                return newCart;
            } else {
                // Add new item with variant
                toast.success('Added to cart!');
                return [...prevCart, {
                    product,
                    quantity,
                    orderType,
                    variant // NEW: Store selected variant
                }];
            }
        });
    };

    // NEW: Updated to handle variants
    const removeFromCart = (productId, orderType, variantId = null) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(
                    item.product.id === productId &&
                    item.orderType === orderType &&
                    item.variant?.id === variantId // NEW: Match variant too
                )
            )
        );
        toast.success('Removed from cart');
    };

    // NEW: Updated to handle variants
    const updateQuantity = (productId, orderType, newQuantity, variantId = null) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, orderType, variantId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product.id === productId &&
                    item.orderType === orderType &&
                    item.variant?.id === variantId // NEW: Match variant too
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.success('Cart cleared');
    };

    // NEW: Updated to calculate price from variant
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            // Use variant price if available, fallback to product price
            let price;
            if (item.variant) {
                price = item.orderType === 'WHOLESALE'
                    ? parseFloat(item.variant.wholesalePrice)
                    : parseFloat(item.variant.retailPrice);
            } else {
                price = item.orderType === 'WHOLESALE'
                    ? parseFloat(item.product.wholesalePrice)
                    : parseFloat(item.product.retailPrice);
            }
            return total + (price * item.quantity);
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
