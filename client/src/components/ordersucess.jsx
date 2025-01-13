import React from 'react';

const OrderSuccess = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🎉 Order Successful! 🎉</h1>
                <p style={styles.message}>
                    Thank you for your purchase! Your order is being processed and will be shipped soon.
                </p>
                <button style={styles.button} onClick={() => window.location.href = '/'}>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    title: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default OrderSuccess;
