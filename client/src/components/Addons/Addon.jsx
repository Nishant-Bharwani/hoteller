import React, { useState } from 'react';
import AddonIcon from './AddonIcon';

const Addon = ({ addon, isSelected, onToggleSelection }) => {
    const [selected, setSelected] = useState(isSelected);

    const handleToggleSelection = () => {
        setSelected((prevSelected) => !prevSelected);
        // onToggleSelection(addon._id);
        onToggleSelection(addon);
    };

    return (
        <div className='pl-8 pr-8'>
            <div className='relative w-full ml-0 mr-0'>
                <div className='pb-[16px] flex flex-row gap-1'>
                    <div className='flex flex-col gap-[0.1rem]'>
                        <div onClick={handleToggleSelection} className='flex flex-row gap-4 items-center cursor-pointer'>
                            <AddonIcon isChecked={selected} addonSlug={addon.addonSlug} />
                            <span className='capitalize'>{addon.name}</span>
                        </div>
                        <div className='text-neutral-500'>{addon.description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addon