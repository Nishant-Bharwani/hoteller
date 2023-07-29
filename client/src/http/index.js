import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
});

// List of all Endpoints
export const registerUser = (data) => api.post('/api/v1/auth/register', data);
export const loginUser = (data) => api.post('/api/v1/auth/login', data);
export const logoutUser = () => api.post('/api/v1/auth/logout');
export const sendEmailVerificationLink = () => api.post('/api/v1/auth/send-email-verification-link');
export const verifyEmail = (token) => api.post(`/api/v1/auth/verify-email/${token}`);


export const getAllHotels = () => api.get('/api/v1/hotel/all-hotels-list');

// Interceptors

// api.interceptors.response.use(
//     (config) => {
//         return config;
//     },
//     async (error) => {
//         const orignalRequest = error.config;

//         if (error.response.status === 401 && orignalRequest && !orignalRequest.isRetry) {
//             orignalRequest.isRetry = true;
//             try {
//                 await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, {
//                     withCredentials: true
//                 });

//                 return api.request(orignalRequest);
//             } catch (err) {
//                 console.log(err.message);
//             }
//         }

//         throw error;
//     }
// );

export default api;