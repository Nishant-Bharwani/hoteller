import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLoginModal from '../../hooks/useLoginModal';
import useRegisterModal from '../../hooks/useRegisterModal';
import { logoutUser } from '../../http';
import { setAuth } from '../../store/authSlice';
import Avatar from '../shared/avatar/Avatar';
import MenuItem from './MenuItem';

const UserMenu = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state) => state.persistedAuthReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);


    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(setAuth({ user: null }));
            toast.success("Logout successull", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate('/');
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.result?.error, {
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

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div onClick={() => { }} className="hidden md:block text-sm font-semibold px-3 py-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                    Become a Hoteller now
                </div>

                <div onClick={toggleOpen} className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full cursor-pointer hover: shadow-md transition">
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        {!(user?.status === 'login') ? (<>
                            <MenuItem onClick={loginModal.onOpen} label="Login" />
                            <MenuItem onClick={registerModal.onOpen} label="Sign up" />
                        </>) : (
                            <>
                                <MenuItem label="My bookings" onClick={() => navigate('/user/bookings')} />
                                <MenuItem label="My profile" />
                                <MenuItem onClick={handleLogout} label="Logout" />
                            </>

                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserMenu;