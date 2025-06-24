import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import MealList from './MealList';
import Cart from './Cart';
import CheckoutForm from './CheckoutForm';

// Make sure to add your publishable key
const stripePromise = loadStripe('pk_test_51RdJgrEHk4t8WqpIbEiKn28pleTmJIjKVJXvZIFoAWVnDrJjngmgKI0Vqt39srWdp9f7ScccmURO5vitOwTmpEWt00pqgrW9pr');

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CLP: '$',
};

// Main App Component
export default function App() {
    const [meals, setMeals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currency, setCurrency] = useState('USD');

    // Fetch initial data
    useEffect(() => {
        axios.get('/api/v1/categories')
            .then(resp => setCategories(resp.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const fetchMeals = useCallback((params = {}) => {
        const apiParams = { ...params, currency };
        axios.get('/api/v1/meals', { params: apiParams })
            .then(resp => setMeals(resp.data))
            .catch(error => console.error("Error fetching meals:", error));
    }, [currency]);

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
    };

    // Debounced search handler
    const debouncedFetchMeals = useMemo(() =>
            debounce(params => fetchMeals(params), 300)
        , [fetchMeals]);

    useEffect(() => {
        const params = {
            search: searchTerm,
            category_id: selectedCategory,
            sort_by: sortConfig.key,
            sort_dir: sortConfig.direction,
        };
        debouncedFetchMeals(params);
    }, [searchTerm, selectedCategory, sortConfig, debouncedFetchMeals]);


    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const addToCart = (meal) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === meal.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...meal, quantity: 1, price: meal.price, currency: currency }];
        });
    };

    const updateQuantity = (mealId, amount) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === mealId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
            ).filter(item => item.quantity > 0);
        });
    };

    const handleCheckout = () => {
        const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        if (totalAmount <= 0) {
            alert("Your cart is empty!");
            return;
        }
        // Create PaymentIntent on the server
        axios.post('/api/v1/payments/create_payment_intent', {
            amount: Math.round(totalAmount * 100), // amount in cents
            currency: currency.toLowerCase()
        })
            .then(response => {
                setClientSecret(response.data.clientSecret);
                setShowCheckout(true);
            })
            .catch(error => console.error("Error creating payment intent:", error));
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Food App</h1>
                    <div className="flex items-center">
                        <select
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            value={currency}
                            className="mr-4 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CLP">CLP</option>
                        </select>
                        <Cart cart={cart} updateQuantity={updateQuantity} onCheckout={handleCheckout} currency={currency} currencySymbol={currencySymbols[currency]}/>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {showCheckout ? (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
                        {clientSecret && (
                            <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        )}
                        <button onClick={() => setShowCheckout(false)} className="mt-4 w-full text-center text-gray-600 hover:text-gray-800">Back to Meals</button>
                    </div>
                ) : (
                    <>
                        {/* Filter and Sort Controls */}
                        <div className="mb-8 p-4 bg-white rounded-lg shadow">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Search meals..."
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <select
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    value={selectedCategory}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <div className="flex items-center justify-around">
                                    <button onClick={() => handleSort('name')} className="font-semibold text-gray-700 hover:text-blue-500">Name</button>
                                    <button onClick={() => handleSort('price')} className="font-semibold text-gray-700 hover:text-blue-500">Price</button>
                                    <button onClick={() => handleSort('rating')} className="font-semibold text-gray-700 hover:text-blue-500">Rating</button>
                                </div>
                            </div>
                        </div>

                        {/* Meal Listing */}
                        <MealList meals={meals} onAddToCart={addToCart} currency={currency} currencySymbol={currencySymbols[currency]} />
                    </>
                )}
            </main>
        </div>
    );
}