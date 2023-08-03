import React, { useEffect, useState } from 'react';
import { getAllAddons } from '../../http';
import Heading from '../primitives/Heading';
import Addon from './Addon';

const Addons = ({ selectedAddons, onToggleSelection }) => {
    const [addons, setAddons] = useState([]);


    const shouldBeSelected = (addon) => {
        selectedAddons.forEach((selectedAddon) => {
            if (selectedAddon?._id === addon?._id) {
                return true;
            }
        });

        return false;
    };

    const handleToggleSelection = (addon) => {
        onToggleSelection(addon);
    };


    useEffect(() => {
        const hanldeGetAllAddons = async () => {
            try {
                const { data } = await getAllAddons();
                setAddons(data?.result?.data);
            } catch (err) {
                console.log(err);
                setAddons([]);
            }
        };

        hanldeGetAllAddons();

    }, []);

    return (
        <div className='pb-[48px] flex flex-col gap-4'>
            <Heading title="Select Addons" subtitle="Click on a addon to select or unselect it" center />
            <div className='flex flex-col gap-3'>
                {addons.map((addon) => (
                    <Addon key={addon._id} addon={addon} isSelected={shouldBeSelected(addon)} onToggleSelection={handleToggleSelection} />
                ))}
            </div>
        </div>
    )
}

export default Addons