import React, { useState } from 'react';
import { authClient } from '../api';

export default function SignUp({ onSignUp, setView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        
        if (password !== passwordConfirmation) {
            setErrors(["Passwords don't match"]);
            return;
        }
        
        authClient.post('/signup', {
            user: { 
                email, 
                password, 
                password_confirmation: passwordConfirmation 
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            const token = response.headers.authorization;
            onSignUp(response.data.data, token);
        }).catch(err => {
            console.error("Signup error:", err);
            if (err.response && err.response.data && err.response.data.status && err.response.data.status.errors) {
                setErrors(err.response.data.status.errors);
            } else {
                setErrors(["Could not create account. Please try again."]);
            }
        });
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div><h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create a new account</h2></div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md">
                            <ul className="list-disc pl-5">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div><input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Email address" /></div>
                        <div><input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Password" /></div>
                        <div><input id="password-confirmation" name="passwordConfirmation" type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Confirm Password" /></div>
                    </div>
                    <div><button type="submit" className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button></div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">Or{' '}<button onClick={() => setView('login')} className="font-medium text-indigo-600 hover:text-indigo-500">sign in to your account</button></p>
            </div>
        </div>
    );
}