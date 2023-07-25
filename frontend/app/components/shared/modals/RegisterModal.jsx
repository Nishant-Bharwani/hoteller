'use client';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import Heading from '../Heading';
import ImageInput from '../ImageInput';
import Input from '../Input';
import Modal from './Modal';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            fullname: '',
            phone: '',
            password: '',
            dob: '',
            gender: '',
            address: '',
            avatar: ''

        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);

        // Axios req
        try {
            await axios.post('/api/register', data);
            registerModal.onClose();
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Become a Hoteller now!' subtitle='Create a account' />
            <Input id="username" label="Enter your username" disabled={isLoading} register={register} errors={errors} required />
            <Input id="email" label="Enter your email address" disabled={isLoading} register={register} errors={errors} required />
            <Input id="fullname" label="Enter your Full Name" disabled={isLoading} register={register} errors={errors} required />
            <Input id="phone" label="Enter your Phone (optional)" disabled={isLoading} register={register} errors={errors} />
            <Input id="password" label="Enter your Password" type='password' disabled={isLoading} register={register} errors={errors} required />
            <Input id="dob" label="Enter your Date of Birth" type='date' disabled={isLoading} register={register} errors={errors} required />

            <Input id="gender" label="Enter your Gender" disabled={isLoading} register={register} errors={errors} required />
            <Input id="address" label="Enter your Address" disabled={isLoading} register={register} errors={errors} required />
            <ImageInput id="avatar" label="Select your Avatar" type='file' disabled={isLoading} register={register} errors={errors} required multiple />

        </div>
    );

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                <span class="absolute px-3 font-large text-sky-500 -translate-x-1/2 bg-white left-1/2 ">OR</span>
            </div>
            <Button
                outline
                label={"Continue with Google"}
                icon={FcGoogle}
                onClick={() => { }}
            />
            <Button
                outline
                label={"Continue with Github"}
                icon={AiFillGithub}
                onClick={() => { }}
            />

            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <div>Already have an account? </div>
                    <div onClick={registerModal.onClose} className='text-neutral-800 cursor-pointer hover:underline'>Login </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Modal disabled={isLoading} isOpen={registerModal.isOpen} title="Register" actionLabel="Continue" onClose={registerModal.onClose} body={bodyContent} onSubmit={handleSubmit(onSubmit)}
                footer={footerContent} />
        </div>
    );
}

export default RegisterModal;