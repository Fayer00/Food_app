import React, { useState } from 'react';

export default function Cart({ cart, updateQuantity, onCheckout, currency, currencySymbol }) {
    const [isOpen, setIsOpen] = useState(false);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((count, item) => count + item.quantity, 0)}</span>}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20">
                    <div className="p-4">
                        <h4 className="text-lg font-bold">Shopping Cart</h4>
                        <hr className="my-2"/>
                        {cart.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <>
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-600">{currencySymbol}{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                                        </div>
                                    </div>
                                ))}
                                <hr className="my-2"/>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>{currencySymbol}{total}</span>
                                </div>
                                <button onClick={onCheckout} className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                                    Checkout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}