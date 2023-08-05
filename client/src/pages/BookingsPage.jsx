import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Bookings from '../components/Bookings/Bookings';
import EmptyState from '../components/shared/EmptyState';
import Loader from '../components/shared/Loader/Loader';
import { getBookingsByUserId } from '../http';

const BookingsPage = () => {

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.persistedAuthReducer);


    useEffect(() => {
        const getBookings = async () => {
            setIsLoading(true);
            try {
                const { data } = await getBookingsByUserId(user?._id);
                setBookings(data?.result?.data);

            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }

        getBookings();
    }, [user?._id]);


    if (!user) {
        return <EmptyState title='Unauthorized' subtitle='Please Login and try again' />
    }

    if (isLoading) return <Loader />

    if (bookings.length === 0) {
        return <EmptyState title='No bookings yet' subtitle={`Looks like you haven't booked any rooms yet.`} />
    }

    return (
        <Bookings bookings={bookings} user={user} />
    );
};

export default BookingsPage;