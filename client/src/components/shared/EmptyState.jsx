import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../primitives/Button'
import Heading from '../primitives/Heading'

const EmptyState = ({ title, subtitle, showReset }) => {
    const navigate = useNavigate();

    return (
        <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
            <Heading center title={title} subtitle={subtitle} />
            <div className='w-48 mt-4'>
                {showReset && (
                    <Button outline label="Remove filter" onClick={() => navigate('/')} />
                )}
            </div>
        </div>
    )
}

export default EmptyState