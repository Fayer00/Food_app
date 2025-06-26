import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api';
import debounce from 'lodash.debounce';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import MealList from './MealList';
import Cart from './Cart';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51RdJgrEHk4t8WqpIbEiKn28pleTmJIjKVJXvZIFoAWVnDrJjngmgKI0Vqt39srWdp9f7ScccmURO5vitOwTmpEWt00pqgrW9pr');
const currencySymbols = { USD: '$', EUR: '€', GBP: '£', CLP: '$' };

export default function MealCatalog({ currentUser, setView }) {
    const [meals, setMeals] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currency, setCurrency] = useState('USD');

    const fetchWishlist = useCallback(() => {
        if (currentUser) {
            apiClient.get('/wishlist_items')
                .then(response => setWishlist(response.data))
                .catch(error => console.error("Error fetching wishlist:", error));
        } else {
            setWishlist([]);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleAddToWishlist = (meal) => {
        if (!currentUser) {
            setView('login'); // Redirect to login if not authenticated
            return;
        }
        apiClient.post('/wishlist_items', { wishlist_item: { wishlistable_id: meal.id, wishlistable_type: 'Meal' }})
            .then(() => fetchWishlist())
            .catch(error => console.error("Error adding to wishlist", error));
    };

    const handleRemoveFromWishlist = (meal) => {
        const wishlistItem = wishlist.find(item => item.wishlistable_id === meal.id);
        if (wishlistItem) {
            apiClient.delete(`/wishlist_items/${wishlistItem.id}`)
                .then(() => fetchWishlist())
                .catch(error => console.error("Error removing from wishlist", error));
        }
    };

    const fetchMeals = useCallback((params = {}) => {
        apiClient.get('/meals', { params })
            .then(resp => setMeals(resp.data))
            .catch(error => console.error("Error fetching meals:", error));
    }, []);

    const handleCurrencyChange = (newCurrency) => setCurrency(newCurrency);
    const handleSort = (key) => setSortConfig(c => ({key, direction: c.key === key && c.direction === 'asc' ? 'desc' : 'asc'}));
    const addToCart = (meal) => setCart(c => c.find(i => i.id === meal.id) ? c.map(i => i.id === meal.id ? {...i, quantity: i.quantity + 1} : i) : [...c, {...meal, quantity: 1}]);
    const updateQuantity = (id, amt) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + amt)} : i).filter(i => i.quantity > 0));

    const handleCheckout = () => {
        const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        if (totalAmount <= 0) {
            alert("Your cart is empty!");
            return;
        }
        apiClient.post('/payments/create_payment_intent', { amount: Math.round(totalAmount * 100), currency: currency.toLowerCase() })
            .then(response => {
                setClientSecret(response.data.clientSecret);
                setShowCheckout(true);
            })
            .catch(error => console.error("Error creating payment intent:", error));
    };

    useEffect(() => {
        apiClient.get('/categories')
            .then(resp => setCategories(resp.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const debouncedFetchMeals = useMemo(() => debounce(fetchMeals, 300), [fetchMeals]);

    useEffect(() => {
        debouncedFetchMeals({
            search: searchTerm,
            category_id: selectedCategory,
            sort_by: sortConfig.key,
            sort_dir: sortConfig.direction,
            currency: currency,
        });
    }, [searchTerm, selectedCategory, sortConfig, currency, debouncedFetchMeals]);

    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <select onChange={(e) => handleCurrencyChange(e.target.value)} value={currency} className="mr-4 p-2 border border-gray-300 rounded-md">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CLP">CLP</option>
                        </select>
                    </div>
                    <Cart cart={cart} updateQuantity={updateQuantity} onCheckout={handleCheckout} currency={currency} currencySymbol={currencySymbols[currency]}/>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
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
                        <div className="mb-8 p-4 bg-white rounded-lg shadow">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                                <input type="text" placeholder="Search meals..." className="p-2 border border-gray-300 rounded-md w-full" onChange={(e) => setSearchTerm(e.target.value)} />
                                <select className="p-2 border border-gray-300 rounded-md w-full" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                <div className="flex items-center justify-around">
                                    <button onClick={() => handleSort('name')} className="font-semibold text-gray-700 hover:text-blue-500">Name</button>
                                    <button onClick={() => handleSort('price')} className="font-semibold text-gray-700 hover:text-blue-500">Price</button>
                                    <button onClick={() => handleSort('rating')} className="font-semibold text-gray-700 hover:text-blue-500">Rating</button>
                                </div>
                            </div>
                        </div>

                        <MealList
                            meals={meals}
                            wishlist={wishlist}
                            onAddToCart={addToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onRemoveFromWishlist={handleRemoveFromWishlist}
                            currency={currency}
                            currencySymbol={currencySymbols[currency]}
                        />
                    </>
                )}
            </div>
        </>
    );
}