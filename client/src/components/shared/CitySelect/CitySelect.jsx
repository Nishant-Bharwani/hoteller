import Select from 'react-select';


import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCities } from '../../../http';



const CitySelect = ({ value, onChange }) => {

    const [cities, setCities] = useState([]);

    const customFilter = (option, searchText) => {
        const searchLowerCase = searchText.toLowerCase();
        return (
            option.data.name.toLowerCase().includes(searchLowerCase) ||
            option.data.state.toLowerCase().includes(searchLowerCase)
        );
    };

    useEffect(() => {
        const handleGetAllCities = async () => {
            try {
                const { data } = await getAllCities();
                setCities(data?.result?.data);
            } catch (err) {
                toast.error(err?.response?.data?.result?.error || "Unable to fetch cities", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        };
        handleGetAllCities();
    }, []);

    return (
        <div>
            <Select
                filterOption={customFilter}
                placeholder="Search By City"
                isClearable
                options={cities}
                value={value?.name}
                onChange={(value) => onChange(value)}
                formatOptionLabel={(option) => (
                    <div className="flex flex-row items-center gap-3">
                        <div>
                            {option.name},
                            <span className="text-neutral-500 ml-1">
                                {option.state}
                            </span>
                        </div>
                    </div>
                )}
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg'
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: 'black',
                        primary25: '#bae6fd'
                    }
                })}
            />
        </div>
    )
};

export default CitySelect;