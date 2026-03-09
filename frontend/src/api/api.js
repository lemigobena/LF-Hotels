/**
 * API Utility Wrapper
 * 
 * This module provides a simple wrapper around the native Fetch API to interact with the backend.
 * It is designed to mimic the Axios interface to maintain compatibility with existing project code
 * while eliminating the overhead of external dependencies.
 */

let BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Normalize BASE_URL to prevent trailing slash issues
BASE_URL = BASE_URL.replace(/\/$/, '');

// Vercel deployment safety check: if the user provided their backend domain 
// but forgot the /api suffix, we append it so requests hit the serverless function.
if (BASE_URL !== '/api' && !BASE_URL.endsWith('/api')) {
    BASE_URL += '/api';
}

// This function does all the fetch work
const request = async (endpoint, options = {}) => {
    // get token from the storage
    const token = sessionStorage.getItem('token');

    // set the headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    // run the fetch
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        body: options.data ? JSON.stringify(options.data) : options.body,
    });

    // check if it is okay
    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'something went wrong');
        error.response = { data: errorData };
        throw error;
    }

    // return the data
    return { data: await response.json() };
};

// my global thing for api
const api = {
    get: (url, options) => request(url, { ...options, method: 'GET' }),
    post: (url, data, options) => request(url, { ...options, method: 'POST', data }),
    put: (url, data, options) => request(url, { ...options, method: 'PUT', data }),
    delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};

export default api;
