'use client';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import { useState } from 'react';
import Heading from '../Heading';
import Input from '../Input';
import Modal from './Modal';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',

        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);

        // Axios req
        try {
            await axios.post('/api/register', data);
            registerModal.onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Become a Hoteller now!' subtitle='Create a account' />
            <Input id="email" label="Enter your email address" disabled={isLoading} register={register} errors={errors} required />
        </div>
    );

    return (
        <div>
            <Modal disabled={isLoading} isOpen={registerModal.isOpen} title="Register" actionLabel="Continue" onClose={registerModal.onClose} body={bodyContent} onSubmit={handleSubmit(onSubmit)} />
        </div>
    );
}

export default RegisterModal;