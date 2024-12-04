import axios from 'axios';

// Use environment variables to set the correct baseURL
const baseURL = (import.meta.env.VITE_BACKEND_URL || '') + '/api';
console.log(baseURL);

// Create Axios instance with base URL
const api = axios.create({
    baseURL,
    withCredentials: true, // Include cookies if needed
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors in the response
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || '';

            // monitor /verify
            if (status === 401) {
                if (message.includes('No token provided') || message.includes('Token expired')) {
                    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                        window.location.href = '/login';
                    }
                }
            }

            // The request was made and the server responded with a status code
            console.error('API Error Response:', error.response.status, error.response.data.message);
            // alert(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong'}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error Request:', error.request);
            // alert('Network error: No response from server');
        } else {
            // Something happened in setting up the request
            console.error('API Error Message:', error.message);
            // alert('Error: ' + error.message);
        }
        return Promise.reject(error); // Reject the promise
    }
);

// Define common HTTP methods
const get = async (url, params = {}) => {
    const res = await api.get(url, { params });
    return res.data;
};

// Handle POST requests for JSON data
const post = async (url, data, isMultipart = false) => {
    const headers = isMultipart
        ? { 'Content-Type': 'multipart/form-data' } // For file uploads
        : { 'Content-Type': 'application/json' }; // For JSON data

    const res = await api.post(url, data, { headers });
    return res.data;
};

// Handle PUT requests
const put = async (url, data) => {
    const res = await api.put(url, data, {
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
};

// Handle DELETE requests
const del = async (url) => {
    const res = await api.delete(url);
    return res.data;
};

const upload = async (url, data) => {
    const axiosInstance = await axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    const res = await axiosInstance.post(url, data);
    return res.data;
};
export { get, post, put, del, upload };
