import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Room from '../components/Room/Room';
import { getBookingsByRoomId, getRoomByRoomSlugOrId } from '../http';

const RoomPage = () => {
    const { roomSlug } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [bookings, setBookings] = useState([]);

    const { user } = useSelector((state) => state.persistedAuthReducer);
    useEffect(() => {
        const handleGetRoom = async () => {
            try {
                const { data } = await getRoomByRoomSlugOrId(roomSlug);
                console.log(data.result.data);
                setRoomData(data.result.data);
                console.log(roomData);
            } catch (err) {
                console.log(err);
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
            }
        };

        const getBookings = async () => {
            try {
                const { data } = await getBookingsByRoomId(roomData?._id);
                setBookings(data?.result?.data);
            } catch (err) {
                console.log(err);
                setBookings([]);
            }
        }

        handleGetRoom();
        getBookings();
    }, []);

    return (
        <div className='pb-20 pt-40'>
            <Room data={roomData} user={user} bookings={bookings} />
        </div>
    )
}

export default RoomPage