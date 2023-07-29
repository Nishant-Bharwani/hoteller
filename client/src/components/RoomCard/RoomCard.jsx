import React, { useCallback, useMemo } from 'react';
import { BiRupee } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Button from '../primitives/Button';
import Image from '../primitives/Image';


const RoomCard = ({ data, onAction, disabled, actionLabel, actionId = "", user }) => {
    const navigate = useNavigate();
    const handleCancel = useCallback((e) => {
        e.stopPropagation();

        if (disabled) return;

        onAction?.(actionId);

    }, [onAction, actionId, disabled]);


    const price = useMemo(() => {
        return data?.roomPrice
    }, [data?.roomPrice]);

    return (
        <div onClick={() => navigate(`/room/${data.hotelId}/${data.roomSlug}`)} className='col-span-1 cursor-pointer group '>
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image fill="true" alt={"Hotel"} src={data.roomImages[0].url} className="object-cover w-full group-hover:scale-110 transition" />


                </div>

                <div className='font-semibold text-lg'>{data?.roomName}</div>
                {data.roomDescription && <div className='font-light text-neutral-500'>
                    {data?.roomDescription}
                </div>}
                {data.roomPrice && <div className='flex flex-row gap-2 items-center font-light text-neutral-500 text-[20px]'>
                    <BiRupee size={24} className='text-neutral-700 inline-block m-0' />
                    <span className='font-semibold text-yellow-800'>
                        {price}
                    </span> per day
                </div>}

                {onAction && actionLabel && (
                    <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default RoomCard;