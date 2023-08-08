import { differenceInCalendarDays, eachDayOfInterval, format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLoginModal from '../../hooks/useLoginModal';
import { bookRoom } from '../../http';
import Addons from '../Addons/Addons';
import Container from '../shared/container/Container';
import RoomBookings from './RoomBookings';
import RoomHead from './RoomHead';
import RoomInfo from './RoomInfo';
const { utcToZonedTime } = require("date-fns-tz");

const intialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
};

const Room = ({ data, user, bookings = [] }) => {
    const loginModal = useLoginModal();
    const navigate = useNavigate();
    const disabledDates = useMemo(() => {
        let dates = [];
        bookings.forEach((booking) => {
            const range = eachDayOfInterval({
                start: new Date(booking.checkIn),
                end: new Date(booking.checkOut)
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [bookings]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(data?.roomPrice);
    const [dateRange, setDateRange] = useState(intialDateRange);
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedAddonIds, setSelectedAddonIds] = useState([]);

    function parseDate(dateString) {
        const timeZone = "Asia/Kolkata";
        const dateObject = new Date(dateString);
        const zonedDate = utcToZonedTime(dateObject, timeZone);
        const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });
        return formattedDate;
    }

    const handleToggleSelection = (addon) => {
        setSelectedAddonIds((prevSelectedIds) =>
            prevSelectedIds.includes(addon?._id)
                ? prevSelectedIds.filter((id) => { return id !== addon?._id })
                : [...prevSelectedIds, addon._id]
        );


        const addonId = addon._id;
        const addonExists = selectedAddons.find((selectedAddon) => selectedAddon._id === addonId);

        if (addonExists) {
            setSelectedAddons((prevSelectedAddons) =>
                prevSelectedAddons.filter((selectedAddon) => selectedAddon._id !== addonId)
            );
        } else {
            setSelectedAddons((prevSelectedAddons) => [...prevSelectedAddons, addon]);
        }
    };

    const createBooking = useCallback(async () => {
        if (!user) {
            return loginModal.onOpen();
        }

        setIsLoading(true);
        try {
            const { data: bookRoomData } = await bookRoom({
                roomId: data?._id,
                checkIn: parseDate(dateRange.startDate),
                checkOut: parseDate(dateRange.endDate),
                numberOfGuests,
                addons: selectedAddonIds
            });

            const booking = bookRoomData.result.data.booking;
            const razorpayOrder = bookRoomData.result.data.razorpayOrder;

            const API_URL = process.env.NODE_ENV === 'production' ? 'https://hoteller.onrender.com' : 'http://localhost:5000';
            const RAZORPAY_KEY_ID = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID;

            const razorpayOptions = {
                key: RAZORPAY_KEY_ID,
                amount: booking.totalPrice,
                currency: "INR",
                name: "Hoteller",
                description: `${data.roomName}`,
                image: `${API_URL}/public/logo.png`,
                order_id: razorpayOrder.id,
                callback_url: `${API_URL}/api/v1/payment/confirm-payment?bookingId=${booking._id}`,
                headers: {
                    'orderId': `${razorpayOrder.id}`
                },
                prefill: {
                    name: user.fullname,
                    email: user.email,
                },
                notes: {
                    "address": "Razorpay Corporate Office",
                    "orderId": razorpayOrder.id
                },
                theme: {
                    "color": "#3b82f6"
                },
                redirect: false,
            };


            const razor = new window.Razorpay(razorpayOptions);
            razor.on('payment.success', function (response) {
                const responseData = response?.detail || {};
                if (responseData.status === 'completed') {
                    setDateRange(intialDateRange);
                    toast.success("Your Room is booked", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    navigate('/user/bookings');
                }
            });

            razor.on('payment.error', function (response) {
                const responseData = response?.detail || {};
                if (responseData.status === 'failed') {
                    toast.error("Payment failed. Please try again.", {
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
            });
            razor.open();
        } catch (err) {

            toast.error(err?.response?.data?.result?.error || "Unable to book room", {
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

    }, [navigate, data?._id, dateRange.endDate, dateRange.startDate, loginModal, user, numberOfGuests, selectedAddonIds, data?.roomName]);


    useEffect(() => {



        if (dateRange.startDate && dateRange.endDate) {
            let dayCount;
            if (dateRange.startDate === dateRange.endDate) {
                dayCount = 1;
            } else {
                dayCount = differenceInCalendarDays(
                    dateRange.endDate,
                    dateRange.startDate
                );
            }

            if (dayCount && data?.roomPrice) {
                setTotalPrice(dayCount * data?.roomPrice);
            } else {
                setTotalPrice(data?.roomPrice);
            }

            let addonPrice = 0;
            for (let i = 0; i < selectedAddons.length; i++) {
                addonPrice += selectedAddons[i]?.price;
            }
            if (addonPrice) setTotalPrice((prev) => prev + (addonPrice * dayCount));
        }


    }, [selectedAddonIds, selectedAddons, dateRange, data?.roomPrice]);


    return (
        <Container>
            <div className='max-w-screen-lg mx-auto'>
                <div className='flex flex-col gap-6'>
                    <RoomHead title={data?.roomName} subtitle={data?.roomDescription} image={data?.roomImages[0]?.url} id={data?._id} user={user} />

                    <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                        <div className='col-span-4 flex flex-col gap-8'>

                            <RoomInfo user={user} type={data?.roomType} size={data?.roomSize} capacity={data?.roomCapacity} status={data?.roomStatus} price={data?.roomPrice} addedBy={
                                {
                                    fullname: data?.addedBy.fullname,
                                    avatar: data?.addedBy.avatar
                                }
                            } />
                            <Addons selectedAddons={selectedAddons} onToggleSelection={handleToggleSelection} />

                        </div>

                        <div className='order-first mb-10 md:order-last md:col-span-3'>
                            <div className="w-full relative mb-4">
                                <input id="numberOfGuests" disabled={isLoading}
                                    placeholder="Number of Guests would be arriving" type={"number"} className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed `} onChange={(e) => { setNumberOfGuests(e.target.value); }} />
                            </div>
                            <RoomBookings status={data?.roomStatus} price={data?.roomPrice} totalPrice={totalPrice} onChangeDate={(value) => setDateRange(value)} dateRange={dateRange} onSubmit={createBooking} disabled={isLoading} disabledDates={disabledDates} selectedAddons={selectedAddons} />
                        </div>
                    </div>
                </div>
            </div>

        </Container>
    );
}

export default Room