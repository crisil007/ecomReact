import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3005/viewCart');
                setCartItems(response.data);
            } catch (err) {
                setError(err.response?.data || 'Failed to fetch cart items');
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    // Add item to the cart
    const addToCart = async (item) => {
        try {
            const response = await axios.post('http://localhost:3005/addCart', item, {
                headers: { 'Content-Type': 'application/json' },
            });
            setCartItems([...cartItems, response.data]);
        } catch (err) {
            setError(err.response?.data || 'Failed to add item to cart');
        }
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price} (Quantity: {item.quantity})
                    </li>
                ))}
            </ul>
            <button onClick={() => addToCart({ id: 1, name: 'Product A', price: 10, quantity: 1 })}>
                Add Product A
            </button>
        </div>
    );
};

export default Cart;
