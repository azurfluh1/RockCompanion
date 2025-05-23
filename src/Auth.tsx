// src/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = 'https://rockcompanionbackend.fly.dev';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (user: User) => Promise<boolean>;
    logout: () => void;
}

export type User = {
    id: string;
    username: string;
    email: string;
    firstname: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    var userData = localStorage.getItem("user");
    const [user, setUser] = useState<any>(userData ? JSON.parse(userData) : null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Optionally fetch user profile
        } else {
        delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
        const res = await axios.post("/api/login", { email, password });
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        return true;
        } catch (err) {
        console.error("Login error:", err);
        return false;
        }
    };

    const register = async (user_obj: User): Promise<boolean> => {
        try {
        const res = await axios.post("/api/register", user_obj);
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        return true;
        } catch (err) {
        console.error("Register error:", err);
        return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login")
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};