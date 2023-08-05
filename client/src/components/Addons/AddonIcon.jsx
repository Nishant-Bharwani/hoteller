import React from 'react';
import addonIcons from '../../data/addons';

const AddonIcon = ({ isChecked, addonSlug }) => {
    const Icon = addonIcons[addonSlug];
    const iconStyle = {
        position: 'relative',
        display: 'inline-block',
    };

    const slantCutStyle = {
        content: "",
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        borderBottom: '3px solid red', // Replace 'red' with your desired line color
        transform: isChecked ? 'skew(-20deg) !important' : 'none', // Adjust the angle (e.g., -20deg) to control the slant
    };

    return (
        <div style={isChecked ? { ...iconStyle, textDecoration: 'line-through' } : iconStyle}>
            {!isChecked && <span style={slantCutStyle}></span>}
            <Icon size={30} />
        </div>
    );
}

export default AddonIcon;
