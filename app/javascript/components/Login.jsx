import React, { useState } from 'react';
import { authClient } from '../api';

export default function Login({ onLogin, setView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        authClient.post('/login', {
            user: { email, password }
        }).then(response => {
            console.log("Login response:", response);
            console.log("Headers:", response.headers);
            console.log("Authorization header:", response.headers.authorization);
            
            const token = response.headers.authorization;
            
            // Check if we're getting the user data correctly
            console.log("Response data:", response.data);
            
            // Try to extract user data from different possible structures
            let userData;
            if (response.data && response.data.data) {
                userData = response.data.data;
                console.log("Found user data in response.data.data:", userData);
            } else if (response.data) {
                userData = response.data;
                console.log("Using response.data as user data:", userData);
            }
            
            // Make sure we have valid user data before calling onLogin
            if (userData && token) {
                onLogin(userData, token);
            } else {
                console.error("Missing user data or token:", { userData, token });
                setError("Login successful but couldn't get user data. Please try again.");
            }
        }).catch(err => {
            console.error("Login error:", err);
            setError('Invalid email or password.');
        });
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div><h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2></div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div><input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Email address" /></div>
                        <div><input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Password" /></div>
                    </div>
                    <div><button type="submit" className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button></div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">Or{' '}<button onClick={() => setView('signup')} className="font-medium text-indigo-600 hover:text-indigo-500">create a new account</button></p>
            </div>
        </div>
    );
}