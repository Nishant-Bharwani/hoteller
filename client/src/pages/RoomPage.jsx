import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Room from '../components/Room/Room';
import Heading from '../components/primitives/Heading';
import Loader from '../components/shared/Loader/Loader';
import { getBookingsByRoomId, getRoomByRoomSlugOrId } from '../http';

const RoomPage = () => {
    const { roomSlug, hotelId } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.persistedAuthReducer);
    useEffect(() => {
        const handleGetRoom = async () => {
            try {
                setIsLoading(true);
                const { data } = await getRoomByRoomSlugOrId(roomSlug, hotelId);
                setRoomData(data?.result?.data);
            } catch (err) {
                toast.error(err?.response?.data?.result?.error || "Unable to get Room information", {
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
                setIsLoading(false);
            }
        };



        handleGetRoom();
    }, [roomSlug, hotelId]);



    useEffect(() => {
        const getBookings = async () => {
            try {
                const { data } = await getBookingsByRoomId(roomData?._id || roomData?.id);
                setBookings(data?.result?.data);
            } catch (err) {
                console.log(err);
            }
        }

        getBookings();
    }, [roomData, roomData?._id]);

    if (isLoading) return <Loader />

    return (
        <div className='flex flex-col items-center justify-betweenpb-20 pt-40'>
            <Room data={roomData} user={user} bookings={bookings} />
        </div>
    )
}

export default RoomPage