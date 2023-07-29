import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginModal from '../../hooks/useLoginModal';
import Container from '../shared/container/Container';
import RoomHead from './RoomHead';
import RoomInfo from './RoomInfo';

const intialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
};

const Room = ({ data, user, bookings }) => {
    const loginModal = useLoginModal();
    const navigate = useNavigate();
    const disabledDates = useMemo(() => {
        let dates = [];
        // bookings.forEach((booking) => {
        //     const range = 
        // });
    });

    return (
        <Container>
            <div className='max-w-screen-lg mx-auto'>
                <div className='flex flex-col gap-6'>
                    <RoomHead title={data.roomName} subtitle={data.roomDescription} image={data.roomImages[0].url} id={data._id} user={user} />

                    <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                        <RoomInfo user={user} type={data.roomType} size={data.roomSize} capacity={data.roomCapacity} status={data.roomStatus} price={data.roomPrice} addedBy={
                            {
                                fullname: data.addedBy.fullname,
                                avatar: data.addedBy.avatar
                            }
                        } />
                    </div>
                </div>
            </div>

        </Container>
    );
}

export default Room