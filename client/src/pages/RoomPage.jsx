import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Room from '../components/Room/Room';
import { getRoomByRoomSlugOrId } from '../http';

const RoomPage = () => {
    const { hotelId, roomSlug } = useParams();
    const [roomData, setRoomData] = useState(null);

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
                toast.error(err.response.data.result.error, {
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

        handleGetRoom();
    }, []);

    return (
        <div className='pb-20 pt-40'>
            <Room data={roomData} user={user} />
        </div>
    )
}

export default RoomPage