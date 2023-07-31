import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Bookings from '../components/Bookings/Bookings';
import EmptyState from '../components/shared/EmptyState';
import { getBookingsByUserId } from '../http';

const BookingsPage = () => {

    const [bookings, setBookings] = useState([]);
    const { user } = useSelector((state) => state.persistedAuthReducer);


    useEffect(() => {
        const getBookings = async () => {
            try {
                const { data } = await getBookingsByUserId(user._id);
                setBookings(data?.result?.data);
                console.log(bookings);

            } catch (err) {
                console.log(err);
            }
        }

        getBookings();
    }, [user._id]);


    if (!user) {
        return <EmptyState title='Unauthorized' subtitle='Please Login and try again' />
    }

    if (bookings.length === 0) {
        return <EmptyState title='No bookings yet' subtitle={`Looks like you haven't booked any rooms yet.`} />
    }

    return (
        <Bookings bookings={bookings} user={user} />
    );
};

export default BookingsPage;