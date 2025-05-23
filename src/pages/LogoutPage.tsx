import React from 'react';
import { useAuth } from '../Auth';

const LogoutPage: React.FC = () => {
    const { logout } = useAuth();

    const handleSubmit = () => {
        logout();
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Account Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LogoutPage;
