import React, { useState } from 'react';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return;
        }

        setLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setErrorMessage('Login failed. Please check your credentials and try again.');
            }
            if (success) {
                navigate("/")
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('An error occurred. Please try again later.');
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <button
                        type="submit"
                        className="cursor-pointer w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div onClick={()=>{navigate("/register")}} className='w-full text-center cursor-pointer text-blue-500'>Register</div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
