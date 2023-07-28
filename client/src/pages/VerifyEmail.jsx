import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from '../components/shared/container/Container';
import { verifyEmail } from '../http';
import { setAuth } from '../store/authSlice';

const VerifyEmail = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        const handleVerifyEmail = async () => {
            try {
                const { data } = await verifyEmail(token);
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
            } catch (err) {
                console.log(err);
                toast.error("Email verification unsuccessfull", {
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

        handleVerifyEmail();
    }, []);

    return (
        <Container>
            <div className='text-center text-3xl font-semibold text-sky-500'>Verifying your Email. . . Please Wait.</div>
        </Container>
    );
};

export default VerifyEmail;