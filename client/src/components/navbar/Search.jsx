import { BiSearch } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';
import useSearchModal from '../../hooks/useSearchModal';

const Search = () => {
    const searchModal = useSearchModal();
    const [searchParams, setSearchParams] = useSearchParams();

    const city = searchParams.get('city');
    const rooms = searchParams.get('rooms');

    return (
        <div onClick={searchModal.onOpen} className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    {city ? city : "Search City"}
                </div>

                {rooms && <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    Any week
                </div>}
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    {rooms && <div className="hidden sm:block">Add Guests</div>}
                    <div className="p-2 bg-sky-500 rounded-full text-white">
                        <BiSearch size={18} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Search;