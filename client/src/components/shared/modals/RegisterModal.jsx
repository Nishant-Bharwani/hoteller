import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import { useState } from 'react';
import { toast } from 'react-toastify';
import useRegisterModal from '../../../hooks/useRegisterModal';
import { registerUser } from '../../../http/index';
import Button from '../../primitives/Button';
import Heading from '../../primitives/Heading';
import ImageInput from '../../primitives/ImageInput';
import Input from '../../primitives/Input';
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
            dob: '',
            gender: '',
            address: '',
            avatar: ''
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);

        const [year, month, day] = data.dob.split("-");
        data.dob = `${day}-${month}-${year}`;
        // Axios req
        try {
            await registerUser(data);
            registerModal.onClose();
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
            <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                <span className="absolute px-3 font-large text-sky-500 -translate-x-1/2 bg-white left-1/2 ">OR</span>
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