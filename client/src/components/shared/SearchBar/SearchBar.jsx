import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    return (
        <div className="w-1/2 text-neutral-600">
            <input
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-sky-500"
                type="search"
                name="search"
                placeholder="Search"
            />
            {/* <button type="submit" className="absolute right-0 top-0">
                <FaSearch />
            </button> */}
        </div>
    );
};

export default SearchBar;
