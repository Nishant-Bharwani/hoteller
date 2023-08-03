import React from 'react';
import Addons from '../Addons/Addons';
import Calendar from '../Calendar/Calendar';
import Button from '../primitives/Button';

const RoomBookings = ({ selectedAddons, price, status, dateRange, totalPrice, onChangeDate, onSubmit, disabled, disabledDates }) => {
    return (
        <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
            <div className='flex flex-row items-center gap-1 p-4'>
                <div className='flex flex-row items-center text-2xl font-semibold'>
                    ₹ {price}
                </div>
                <div className='font-light text-neutral-600'>
                    per night
                </div>


            </div>
            <hr />
            <Calendar value={dateRange} disabledDates={disabledDates} onChange={(value) => onChangeDate(value.selection)} />
            <hr />
            <div className='p-4'>
                <Button disabled={disabled} label="Book Now" onClick={onSubmit} />
            </div>

            {selectedAddons.length !== 0 &&
                <div className='p-4 flex flex-col font-semibold text-lg'>
                    {selectedAddons.map((addon) => (
                        <div key={addon._id} className='p-1 flex flex-row justify-between items-center'>
                            <div className='capitalize'>{addon.name}:</div>
                            <div className='flex flex-row items-center'>
                                ₹&nbsp;
                                <span>{addon.price}</span>
                            </div>
                        </div>
                    ))}
                </div>}
            <hr /> <hr /> <hr /> <hr />
            <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
                <div>Total:</div>
                <div className='flex flex-row items-center'>
                    ₹&nbsp;
                    <span>{totalPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default RoomBookings;