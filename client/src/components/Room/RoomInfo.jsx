import React from 'react';
import { BiRupee } from 'react-icons/bi';
import Avatar from '../shared/avatar/Avatar';

const RoomInfo = ({ user, type, size, capacity, status, price, addedBy }) => {
    return (
        <>
            <div className='flex flex-col gap-2'>
                <div className='text-xl font-semibold flex flex-row items-center gap-2'>
                    <div>Added by <span className='font-bold cursor-pointer'>{addedBy?.fullname}</span></div>
                    <Avatar className='cursor-pointer' src={addedBy?.avatar} />
                </div>

                <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                    <div>Capacity of <span className='font-bold'>{capacity}</span> guests</div>
                    <div>Size of <span className='font-bold'>{size}</span> Sq. Ft.</div>
                    <div className='flex flex-row items-center gap-1'>
                        <span>At a price of </span>

                        <span>
                            <span className='font-bold mr-[2px]'>₹ {price} <span className='font-light'> per night</span></span>
                        </span>
                    </div>
                </div>
            </div>
            <hr />
        </>
    );
};

export default RoomInfo;