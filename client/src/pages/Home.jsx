import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import HotelCard from '../components/HotelCard/HotelCard';
import EmptyState from '../components/shared/EmptyState';
import Loader from '../components/shared/Loader/Loader';
import Container from '../components/shared/container/Container';
import { getAllHotels, getHotelsByCityName } from '../http';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const { user } = useSelector((state) => state.persistedAuthReducer);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');

    const city = searchParams.get('city');

    useEffect(() => {
        const handleGetAllHotels = async () => {
            try {
                setIsLoading(true);
                if (city) {
                    const { data } = await getHotelsByCityName(city);
                    console.log(data.result.data.rows);
                    setHotels(data?.result?.data?.rows);
                } else {
                    const { data } = await getAllHotels(keyword, page, 12, '');
                    console.log(data);
                    console.log(data.result.data.rows);
                    setHotels(data?.result?.data?.rows);
                }
            } catch (err) {
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
            } finally {
                setIsLoading(false);
            }

        };

        handleGetAllHotels();
        console.log(hotels);
    }, [city, page]);

    if (isLoading) {
        return <Loader />
    }


    if (hotels?.length === 0) {
        return <EmptyState title="No matches" subtitle={"Try removing or changing your filters"} showReset />
    }

    return (
        <div className='pb-20 pt-20'>
            <Container>
                <div className='flex flex-row items-center justify-between'>
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
                    {/* <Pagination /> */}
                </div>
            </Container>
        </div>
    )
}

export default Home