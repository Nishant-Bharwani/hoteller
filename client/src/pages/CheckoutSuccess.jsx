import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Heading from '../components/primitives/Heading';
import { confirmPayment } from '../http';

const CheckoutSuccess = () => {

    const { bookingId, transactionId, amount } = useParams();

    useEffect(() => {
        const handleCreatePayment = async () => {
            try {
                const { data } = await confirmPayment({
                    bookingId,
                    transactionId,
                    amount
                });

                toast.error(data?.result?.message || "Payment was successfull", {
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
                toast.error(err?.response?.data?.result?.error || "Payment got failed", {
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

        handleCreatePayment();
    }, [amount, bookingId, transactionId]);

    return (
        <Heading title="Payment successfull" subtitle="Do not refresh you will be redirected" center />
    );
}

export default CheckoutSuccess