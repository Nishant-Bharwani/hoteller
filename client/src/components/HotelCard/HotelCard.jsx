import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../primitives/Button';
import Image from '../primitives/Image';

const HotelCard = ({ data, onAction, disabled, actionLabel, actionId = "", user }) => {
    const handleCancel = useCallback((e) => {
        e.stopPropagation();

        if (disabled) return;

        onAction?.(actionId);

    }, [onAction, actionId, disabled]);


    const price = useMemo(() => {
        return data?.price
    }, [data?.price]);

    return (
        <Link to={`/hotel/${data.hotelSlug}`} className='col-span-1 cursor-pointer group '>
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image fill="true" alt={"Hotel"} src={data.hotelImages[0].url} className="object-cover w-full group-hover:scale-110 transition" />


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
        </Link>
    )
}

export default HotelCard;