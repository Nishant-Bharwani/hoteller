import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../primitives/Button';
import Image from '../primitives/Image';


const RoomCard = ({ data, onAction, disabled, actionLabel, actionId = "", user, booking }) => {
    const navigate = useNavigate();
    const handleCancel = useCallback((e) => {
        e.stopPropagation();

        if (disabled) return;

        onAction?.(actionId);

    }, [onAction, actionId, disabled]);


    const price = useMemo(() => {
        if (booking) {
            return booking?.totalPrice;
        }

        return data?.roomPrice;
    }, [booking?.totalPrice, data?.roomPrice]);


    const bookingDates = useMemo(() => {
        if (!booking) return null;

        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        return `${format(checkIn, 'PP')} - ${format(checkOut, 'PP')}`;

    }, [booking]);



    return (
        <div onClick={() => !booking && navigate(`/room/${data.hotelId}/${data.roomSlug}`)} className='col-span-1 cursor-pointer group '>
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image fill="true" alt={"Hotel"} src={data.roomImages[0].url} className="object-cover w-full group-hover:scale-110 transition" />

                </div>

                <div onClick={() => booking && navigate(`/room/${data.hotelId}/${data.roomSlug}`)} className='font-semibold text-lg'>{data?.roomName} <span className='font-light'>in</span> {booking && data?.hotelId?.name && (
                    <span onClick={() => navigate(data?.hotelId?.hotelSlug ? `/hotel/${data.hotelId.hotelSlug}` : '')} className=' cursor-pointer text-sm'>
                        {data.hotelId.name}
                    </span>)}</div>
                {data.roomDescription && <div className='font-light text-neutral-500'>
                    {data?.roomDescription}
                </div>}

                {bookingDates && <div className="font-light text-neutral-500">
                    {bookingDates}
                </div>}

                {data.roomPrice && <div className='flex flex-row gap-2 items-center font-light text-neutral-500 text-[20px]'>
                    <span className='font-semibold text-yellow-800'>
                        <span className='text-neutral-800'>₹</span> {price}
                    </span> {!booking && <div className="font-light">per night</div>}
                </div>}

                {onAction && actionLabel && (
                    <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default RoomCard;