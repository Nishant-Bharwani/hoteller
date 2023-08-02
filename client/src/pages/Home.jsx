import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard/HotelCard';
import EmptyState from '../components/shared/EmptyState';
import Container from '../components/shared/container/Container';
import { getAllHotels, getHotelsByCityName } from '../http';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const { user } = useSelector((state) => state.persistedAuthReducer);
    const [searchParams, setSearchParams] = useSearchParams();

    const city = searchParams.get('city');

    useEffect(() => {
        const handleGetAllHotels = async () => {
            if (city) {
                const { data } = await getHotelsByCityName(city);
                console.log(data.result.data.rows);
                setHotels(data?.result?.data?.rows);
            } else {
                const { data } = await getAllHotels();
                console.log(data.result.data.rows);
                setHotels(data?.result?.data?.rows);
            }

        };

        handleGetAllHotels();
        console.log(hotels);
    }, [city]);


    if (hotels?.length === 0) {
        return <EmptyState title="No matches" subtitle={"Try removing or changing your filters"} showReset />
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
                        hotels.map((hotel) => {
                            return (
                                <HotelCard key={hotel._id} data={hotel} user={user} />
                            );
                        })
                    }
                </div>
            </Container>
        </div>
    )
}

export default Home