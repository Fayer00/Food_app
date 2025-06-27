import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ currentUser, onLogout }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-3xl font-bold text-gray-800">
                        Food App
                    </Link>
                    <a href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Admin</a>
                </div>
                <nav className="flex items-center space-x-4">
                    {currentUser ? (
                        <>
                            <Link 
                                to="/wishlist" 
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Wishlist
                            </Link>
                            <span className="text-sm text-gray-700">Hi, {currentUser.email}</span>
                            <button 
                                onClick={onLogout} 
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default NavBar;