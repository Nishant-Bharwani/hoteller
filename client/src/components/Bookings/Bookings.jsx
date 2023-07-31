import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import HotelCard from '../HotelCard/HotelCard'
import Heading from '../primitives/Heading'
import Container from '../shared/container/Container'

const Bookings = ({ bookings, user }) => {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id) => {
        setDeletingId(id);

        try {
            // axios.delete()
            // console.log(deletingId);
        } catch (err) {
            toast.error("kk");
        } finally {
            setDeletingId('');
        }
    }, []);

    return (
        <div className='pb-20 pt-[7rem]'>
            <Container>
                <Heading center title='Bookings' subtitle='Where you have been and where are you going' />

                <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                    {bookings.map((booking) => (
                        <HotelCard key={booking._id} data={booking.roomId.hotelId} user={user} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Bookings