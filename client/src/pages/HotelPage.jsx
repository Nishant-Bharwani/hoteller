import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard/RoomCard';
import EmptyState from '../components/shared/EmptyState';
import Container from '../components/shared/container/Container';
import { getRoomsByHotelSlug } from '../http';

const HotelPage = () => {
    const { hotelSlug } = useParams();
    const [rooms, setRooms] = useState([]);
    const { user } = useSelector((state) => state.persistedAuthReducer);

    useEffect(() => {
        const handleGetAllRooms = async () => {
            const { data } = await getRoomsByHotelSlug(hotelSlug);
            console.log(data.result.data);
            setRooms(data?.result?.data);
        };

        handleGetAllRooms();
        console.log(rooms);
    }, []);

    if (rooms.length === 0) {
        return <EmptyState title="No rooms for this hotel" subtitle="Try booking some other hotels available" />
    }

    return (
        <div className='pb-20 pt-20'>
            <Container>
                <div className='
            pt-24 
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
            '>
                    {
                        (rooms.length !== 0 && (rooms?.map((room) => {
                            return (
                                <RoomCard key={room._id} data={room} user={user} />
                            );
                        })))
                    }
                </div>
            </Container>
        </div>
    );
};

export default HotelPage;