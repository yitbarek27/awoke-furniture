import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) setCartItems(JSON.parse(storedCart));

        const storedAddress = localStorage.getItem('shippingAddress');
        if (storedAddress) setShippingAddress(JSON.parse(storedAddress));
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    const addToCart = (product, qty) => {
        const item = {
            product: product._id,
            name: product.name,
            image: product.imageUrl,
            price: product.price,
            qty,
        };

        const existItem = cartItems.find((x) => x.product === item.product);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                )
            );
        } else {
            setCartItems([...cartItems, item]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                shippingAddress,
                saveShippingAddress,
                paymentMethod,
                setPaymentMethod,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
