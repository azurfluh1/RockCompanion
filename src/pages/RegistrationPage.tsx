import React, { useState } from 'react';
import { useAuth, User } from '../Auth';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const { register, login } = useAuth();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage('All fields other than firstname are required');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const newUser: User = {
                id: "",
                username: username,
                email: email,
                firstname: firstname,
                password: password,
            }
            const success = await register(newUser);
            if (success) {
                console.log('Registration successful');
                login(email, password);
                navigate("/")
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } catch (err) {
            setErrorMessage('An error occurred. Please try again later.');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstname" className="block text-sm font-semibold text-gray-600">Firstname (optional)</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Enter your first name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <div onClick={()=>{navigate("/login")}} className='w-full text-center cursor-pointer text-blue-500'>Login</div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;
