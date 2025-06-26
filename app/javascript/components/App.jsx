import React, { useState, useEffect } from 'react';
import apiClient, { authClient } from '../api';

// Import new components
import MealCatalog from './MealCatalog';
import Wishlist from './Wishlist';
import Login from './Login';
import SignUp from './SignUp';

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('catalog'); // 'catalog', 'login', 'signup', 'wishlist'

    // Check for a logged-in user on initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    // Verify the token is still valid with the server
                    try {
                        // Optional: Make a request to verify the token
                        // const response = await authClient.get('/current_user');
                        // setCurrentUser(response.data);
                        
                        // Or just use the stored user data
                        setCurrentUser(JSON.parse(storedUser));
                    } catch (error) {
                        console.error("Token validation error:", error);
                        // Token is invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setCurrentUser(null);
                    }
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    const handleLogin = (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setView('catalog'); // Go back to catalog after login
    };

    const handleLogout = () => {
        // Use authClient instead of apiClient for logout
        authClient.delete('/logout')
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setCurrentUser(null);
                setView('catalog');
            })
            .catch(error => {
                console.error("Logout error:", error);
                // Even if the server request fails, clear local storage and user state
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setCurrentUser(null);
                setView('catalog');
            });
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return <Login onLogin={handleLogin} setView={setView} />;
            case 'signup':
                return <SignUp onSignUp={handleLogin} setView={setView} />; // Use onLogin because signup also returns user/token
            case 'wishlist':
                return <Wishlist currentUser={currentUser} />;
            default:
                return <MealCatalog currentUser={currentUser} setView={setView} />;
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setView('catalog')} className="text-3xl font-bold text-gray-800">Food App</button>
                        <a href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Admin</a>
                    </div>
                    <nav className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <button onClick={() => setView('wishlist')} className="text-sm font-medium text-gray-500 hover:text-gray-900">Wishlist</button>
                                <span className="text-sm text-gray-700">Hi, {currentUser.email}</span>
                                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setView('login')} className="text-sm font-medium text-gray-500 hover:text-gray-900">Login</button>
                                <button onClick={() => setView('signup')} className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">Sign Up</button>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main>
                {renderView()}
            </main>
        </div>
    );
}