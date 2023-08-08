import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard/RoomCard';
import Heading from '../components/primitives/Heading';
import EmptyState from '../components/shared/EmptyState';
import Loader from '../components/shared/Loader/Loader';
import Container from '../components/shared/container/Container';
import { getRoomsByHotelSlug } from '../http';

const HotelPage = () => {
    const { hotelSlug } = useParams();
    const [rooms, setRooms] = useState([]);
    const { user } = useSelector((state) => state.persistedAuthReducer);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleGetAllRooms = async () => {
            try {
                setIsLoading(true);
                const { data } = await getRoomsByHotelSlug(hotelSlug);
                setRooms(data?.result?.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        handleGetAllRooms();
    }, []);

    if (isLoading) return <Loader />

    if (rooms.length === 0) {
        return <EmptyState title="No rooms for this hotel" subtitle="Try booking some other hotels available" />
    }

    return (
        <div className='pb-20 pt-20'>
            <Container>
                <div className='mt-10 uppercase'>
                    <Heading title={hotelSlug} center />
                </div>
                <div className='
            pt-12 
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