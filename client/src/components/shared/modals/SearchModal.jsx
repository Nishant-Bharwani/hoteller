import qs from 'query-string';
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSearchModal from "../../../hooks/useSearchModal";
import Heading from '../../primitives/Heading';
import CitySelect from '../CitySelect/CitySelect';
import Modal from "./Modal";




const SearchModal = () => {
    const navigate = useNavigate();
    const searchModal = useSearchModal();
    const params = useParams();

    const [city, setCity] = useState("Select a city");

    const onSubmit = useCallback(async () => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery = {
            ...currentQuery,
            city
        }
        const queryString = qs.stringify(updatedQuery, { skipNull: true });
        console.log(queryString);
        const url = `/?${queryString}`;

        searchModal.onClose();
        navigate(url);
    }, [city, searchModal, navigate, params]);

    const bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading title='Where do you want to go' subtitle='Find a perfect city for you' />

            <CitySelect value={city} onChange={(value) => setCity(value?.name)} />
        </div>
    );

    return (
        <Modal isOpen={searchModal.isOpen} onClose={searchModal.onClose} onSubmit={onSubmit} title='Filter By City' actionLabel='Search' body={bodyContent} />
    );
};

export default SearchModal;