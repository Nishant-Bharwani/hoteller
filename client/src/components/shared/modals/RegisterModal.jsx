import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import { useCallback, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useLoginModal from '../../../hooks/useLoginModal';
import useRegisterModal from '../../../hooks/useRegisterModal';
import { registerUser } from '../../../http/index';
import Button from '../../primitives/Button';
import Heading from '../../primitives/Heading';
import ImageInput from '../../primitives/ImageInput';
import Input from '../../primitives/Input';
import Modal from './Modal';


const STEPS = {
    REGISTER: 0,
    VERIFY_EMAIL: 1
};

const RegisterModal = () => {


    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [step, setStep] = useState(STEPS.REGISTER);
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

    const onSubmit = async (_data) => {
        setIsLoading(true);
        console.log(_data);

        const [year, month, day] = _data.dob.split("-");
        _data.dob = `${day}-${month}-${year}`;
        // Axios req
        try {
            const { data } = await registerUser(_data);
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
            // registerModal.onClose();
            setStep((step) => step + 1);
        } catch (err) {
            console.log(err);
            toast.error(err.message, {
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

    const handleEmailVerification = async () => {
        // try {
        //     setIsLoading(true);
        //     const { data } = await sendEmailVerificationLink();
        //     toast.success(data.result.message, {
        //         position: "top-right",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //     });
        //     registerModal.onClose();
        // } catch (err) {
        //     console.log(err);
        //     toast.error(err.response.data.result.error, {
        //         position: "top-right",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //     });
        // } finally {
        //     setIsLoading(false);
        // }

        window.open("https://mail.google.com", "__blank");
        registerModal.onClose();


    };


    const toggle = useCallback(() => {
        loginModal.onOpen();
        registerModal.onClose();
    }, [loginModal, registerModal]);

    const handleClose = useCallback(() => {
        setStep(STEPS.REGISTER);
        registerModal.onClose();
    }, [registerModal]);


    let bodyContent;
    let footerContent
    if (step === STEPS.REGISTER) {

        bodyContent = (
            <div className='flex flex-col gap-4'>
                <Heading title='Become a Hoteller now!' subtitle='Create a account' />
                <Input id="username" label="Enter your username" disabled={isLoading} register={register} errors={errors} required />
                <Input id="email" label="Enter your email address" disabled={isLoading} register={register} errors={errors} required />
                <Input id="fullname" label="Enter your Full Name" disabled={isLoading} register={register} errors={errors} required />
                <Input id="phone" label="Enter your Phone (optional)" disabled={isLoading} register={register} errors={errors} />
                <Input id="password" label="Enter your Password" type='password' disabled={isLoading} register={register} errors={errors} required />
                <Input id="dob" label="Enter your Date of Birth" type='date' disabled={isLoading} register={register} errors={errors} required />

                {/* <Input id="gender" label="Enter your Gender" disabled={isLoading} register={register} errors={errors} required /> */}
                {/* <Select name='gender' placeholder='Select your gender' isClearable options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                ]} {...register('gender', { required: true })} isDisabled={isLoading} id='gender' className={`${errors['gender'] ? 'border-sky-500' : 'border-neutral-300'} ${errors['gender'] ? 'focus:border-sky-500' : 'focus:border-black'}`}
                 /> */}


                <label htmlFor="gender" className="p-0 block text-sm font-medium text-neutral-500">Select gender</label>
                <select id="gender" className="border border-sky-500 text-neutral-500 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder-neutral-400" {...register('gender', { required: true })} disabled={isLoading} placeholder='Select your gender'>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>


                <Input id="address" label="Enter your Address" disabled={isLoading} register={register} errors={errors} required />
                <ImageInput id="avatar" label="Click here to upload your Avatar" type='file' disabled={isLoading} register={register} errors={errors} required multiple />

            </div>
        );
        footerContent = (
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
                        <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>Login </div>
                    </div>
                </div>
            </div>
        );
    } else {
        bodyContent = (
            <div className='text-center text-2xl text-sky-500'>
                We have sent you an email verification link!
                <br />
                Click on the link to verify your email
            </div>
        );
    }


    return (
        <div>
            {step === STEPS.REGISTER ? (<Modal isButtonLoading={isLoading} disabled={isLoading} isOpen={registerModal.isOpen} title="Register" actionLabel="Continue" onClose={handleClose} body={bodyContent} onSubmit={handleSubmit(onSubmit)}
                footer={footerContent} />) : (
                <Modal isButtonLoading={isLoading} disabled={isLoading} isOpen={registerModal.isOpen} title="Verify email" actionLabel={"Open Gmail"} onClose={handleClose} body={bodyContent} onSubmit={handleEmailVerification} />
            )}
        </div>
    );
}

export default RegisterModal;