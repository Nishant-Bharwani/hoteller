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


export const getAllHotels = (keyword, page, limit, sort) => {
    let apiUrl = '/api/v1/hotel/all-hotels-list?';


    if (keyword) {
        apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
    }

    if (page) {
        apiUrl += `&page=${encodeURIComponent(page)}`;
    }

    if (limit) {
        apiUrl += `&limit=${encodeURIComponent(limit)}`;
    }

    if (sort) {
        apiUrl += `&sort=${encodeURIComponent(sort)}`;
    }

    return api.get(apiUrl);
};

export const getHotelsByCityName = (city, page, limit, sort) => {
    let apiUrl = '/api/v1/hotel/get-hotel-by-city?';


    if (city) {
        apiUrl += `&city=${encodeURIComponent(city)}`;
    }

    if (page) {
        apiUrl += `&page=${encodeURIComponent(page)}`;
    }

    if (limit) {
        apiUrl += `&limit=${encodeURIComponent(limit)}`;
    }

    if (sort) {
        apiUrl += `&sort=${encodeURIComponent(sort)}`;
    }

    return api.get(apiUrl);
}


export const getHotelByIdOrSlug = (slugOrId) => api.get(`/api/v1/hotel/get-hotel-by-id-or-slug/${slugOrId}`);
export const getRoomsByHotelSlug = (hotelSlug) => api.get(`/api/v1/room/get-rooms-list-by-hotel-slug/${hotelSlug}`);

export const getRoomByRoomSlugOrId = (slugOrId, hotelId) => api.get(`/api/v1/room/get-room-by-id-or-slug/${slugOrId}/${hotelId}`);

export const bookRoom = (data) => api.post(`/api/v1/booking/book-room`, data);
export const getBookingsByRoomId = (roomId) => api.get(`/api/v1/booking/get-bookings-by-room-id/${roomId}`);


export const getBookingsByUserId = (userId) => api.get(`/api/v1/booking/get-bookings-by-user-id/${userId}`);
export const cancelBooking = (bookingId) => api.delete(`/api/v1/booking/cancel-booking/${bookingId}`);

export const getAllCities = () => api.get('/api/v1/city/get-all-cities');

export const getAllAddons = () => api.get('/api/v1/addon/get-all-addons');

// Interceptors

api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const orignalRequest = error.config;

        if (error.response.status !== 200 && orignalRequest && !orignalRequest.isRetry) {
            orignalRequest.isRetry = true;
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/refresh-token`, {
                    withCredentials: true
                });

                return api.request(orignalRequest);
            } catch (err) {
                console.log(err.message);
            }
        }

        throw error;
    }
);

export default api;