import React from 'react'
import Heading from '../primitives/Heading'
import Image from '../primitives/Image'

const RoomHead = ({ title, subtitle, image, id, user }) => {
    return (
        <>
            <Heading title={title} subtitle={subtitle} />
            <div className='w-full h-[60vh] overflow-hidden rounded-xl relative'>
                <Image alt="Image" src={image} fill="true" className='object-cover w-full' />
                {/* <div className='absolute top-5 right-5'>

                </div> */}


            </div>
        </>
    )
}

export default RoomHead