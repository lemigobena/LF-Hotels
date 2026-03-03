import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app startup
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                // Verify token by fetching user profile
                const res = await api.get('/auth/me');
                setUser(res.data);
            }
        } catch (e) {
            console.log('Login check failed:', e.message);
            // If token is invalid or expired, remove it
            await AsyncStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, ...userData } = res.data;

            await AsyncStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (e) {
            return {
                success: false,
                error: e.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await api.post('/auth/signup', userData);
            const { token, ...newUserData } = res.data;

            await AsyncStorage.setItem('token', token);
            setUser(newUserData);
            return { success: true };
        } catch (e) {
            return {
                success: false,
                error: e.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (e) {
            console.log('Logout error:', e);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
