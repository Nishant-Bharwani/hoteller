import React from 'react';
import { BiRupee } from 'react-icons/bi';
import Avatar from '../shared/avatar/Avatar';

const RoomInfo = ({ user, type, size, capacity, status, price, addedBy }) => {
    return (
        <div className='col-span-4 flex flex-col gap-8'>
            <div className='flex flex-col gap-2'>
                <div className='text-xl font-semibold flex flex-row items-center gap-2'>
                    <div>Added by <span className='font-bold cursor-pointer'>{addedBy?.fullname}</span></div>
                    <Avatar className='cursor-pointer' src={addedBy?.avatar} />
                </div>

                <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                    <div>Capacity of {capacity} guests</div>
                    <div>For {type}</div>
                    <div className='flex flex-row items-center gap-1'>
                        <span>At a price of </span>
                        <BiRupee className='inline-block' />
                        <span>
                            <span className='font-semibold mr-[2px]'>{price}</span>
                            <span>per night</span>
                        </span>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default RoomInfo