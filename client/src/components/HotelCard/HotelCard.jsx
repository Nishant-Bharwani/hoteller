import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../primitives/Button';
import Image from '../primitives/Image';

const HotelCard = ({ data, onAction, disabled, actionLabel, actionId = "", user }) => {
    const navigate = useNavigate();
    const handleCancel = useCallback((e) => {
        e.stopPropagation();

        if (disabled) return;

        onAction?.(actionId);

    }, [onAction, actionId, disabled]);


    return (
        <div onClick={() => navigate(`/hotel/${data.hotelSlug}`)} className='col-span-1 cursor-pointer group '>
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image fill="true" alt={"Hotel"} src={data.hotelImages[0].url} className="object-cover w-full group-hover:scale-110 transition" style={{ height: '100%' }} />


                </div>

                <div className='font-semibold text-lg'>{data?.name}</div>
                {data.description && <div className='font-light text-neutral-500'>
                    {data?.description}
                </div>}
                <div className='flex flex-row items-center gap-1'>
                    {data.city && <div className='font-semibold'>
                        {data?.city?.name}, {data?.city?.state}
                    </div>}
                </div>

                {onAction && actionLabel && (
                    <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default HotelCard;