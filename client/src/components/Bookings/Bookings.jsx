import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cancelBooking } from '../../http';
import RoomCard from '../RoomCard/RoomCard';
import Heading from '../primitives/Heading';
import Container from '../shared/container/Container';

const Bookings = ({ bookings, user }) => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id) => {
        setDeletingId(id);


        const handleCancelBooking = async () => {
            try {
                const { data } = await cancelBooking(id);
                toast.success(data?.result?.data || "Booking cancelled successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                window.location.reload();
            } catch (err) {
                console.log(err);
                toast.error(err?.response?.data?.result?.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } finally {
                setDeletingId('');
            }
        }

        handleCancelBooking();

    }, [deletingId]);

    return (
        <div className='pb-20 pt-[7rem]'>
            <Container>
                <Heading center title='Bookings' subtitle='Where you have been and where are you going' />

                <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                    {bookings.map((booking) => (
                        <RoomCard key={booking._id} data={booking.roomId} user={user} actionId={booking._id} onAction={onCancel} disabled={deletingId === booking._id} actionLabel={booking.status === 'completed' ? 'Checked Out' : 'Cancel booking'} booking={booking} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Bookings