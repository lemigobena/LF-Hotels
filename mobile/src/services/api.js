import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get the host IP automatically for Expo dev server
const getBaseUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    const ip = hostUri ? hostUri.split(':')[0] : 'localhost';

    // In production/builds, you would use a real domain here
    return `http://${ip}:5000/api`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
