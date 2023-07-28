import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import useLoginModal from '../../../hooks/useLoginModal';
import useRegisterModal from '../../../hooks/useRegisterModal';
import { loginUser } from '../../../http/index';
import { setAuth } from '../../../store/authSlice';
import Button from '../../primitives/Button';
import Heading from '../../primitives/Heading';
import Input from '../../primitives/Input';
import Modal from './Modal';


const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            usernameOrEmail: '',
            password: '',
        }
    });

    const onSubmit = async (_data) => {
        setIsLoading(true);

        // Axios req
        try {
            const { data } = await loginUser(_data);
            console.log(data.result.data);
            dispatch(setAuth(data.result));
            toast.success(data.result.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            loginModal.onClose();
        } catch (err) {
            toast.error(err.response.data.result.error, {
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

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Welcome back!' subtitle='Login to your account' />
            <Input id="usernameOrEmail" label="Enter your username or email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" label="Enter your Password" type='password' disabled={isLoading} register={register} errors={errors} required />

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
                    <div>New User to Hoteller? </div>
                    <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>Create an account</div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" actionLabel="Continue" onClose={loginModal.onClose} body={bodyContent} onSubmit={handleSubmit(onSubmit)}
                footer={footerContent} />
        </div>
    );
}

export default LoginModal;