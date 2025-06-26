import React, { useState, useEffect } from 'react';
import apiClient from '../api';

export default function Wishlist({ currentUser }) {
    const [items, setItems] = useState([]);

    const fetchWishlist = () => {
        if (currentUser) {
            apiClient.get('/wishlist_items')
                .then(response => setItems(response.data))
                .catch(error => console.error("Error fetching wishlist:", error));
        }
    }

    useEffect(() => {
        fetchWishlist();
    }, [currentUser]);

    const handleRemove = (itemId) => {
        apiClient.delete(`/wishlist_items/${itemId}`)
            .then(() => fetchWishlist()) // Refetch to update the list
            .catch(error => console.error("Error removing from wishlist", error));
    };

    if (!currentUser) {
        return <div className="container mx-auto p-8 text-center">Please log in to see your wishlist.</div>;
    }

    if (items.length === 0) {
        return <div className="container mx-auto p-8 text-center">Your wishlist is empty.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map(item => (
                    item.wishlistable && (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src={item.wishlistable.image_url} alt={item.wishlistable.name} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{item.wishlistable.name}</h3>
                                <button onClick={() => handleRemove(item.id)} className="w-full text-sm text-red-500 hover:text-red-700">
                                    Remove
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}