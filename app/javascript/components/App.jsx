import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import apiClient, { authClient } from '../api';

import MealCatalog from './MealCatalog';
import MealDetail from './MealDetail';
import Wishlist from './Wishlist';
import Login from './Login';
import SignUp from './SignUp';
import NavBar from './NavBar';

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for a logged-in user on initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
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
    };

    const handleLogout = () => {
        authClient.delete('/api/v1/logout')
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setCurrentUser(null);
            })
            .catch(error => {
                console.error("Logout error:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setCurrentUser(null);
            });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <Router>
            <div className="bg-gray-50 min-h-screen font-sans">
                <NavBar 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                />
                <main>
                    <Routes>
                        <Route path="/" element={<MealCatalog currentUser={currentUser} />} />
                        <Route path="/meals/:id" element={<MealDetail currentUser={currentUser} />} />
                        <Route path="/wishlist" element={
                            currentUser ? <Wishlist currentUser={currentUser} /> : <Navigate to="/login" />
                        } />
                        <Route path="/login" element={
                            currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                        } />
                        <Route path="/signup" element={
                            currentUser ? <Navigate to="/" /> : <SignUp onSignUp={handleLogin} />
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}