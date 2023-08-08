import { useLocation } from 'react-router-dom';
import Container from '../shared/container/Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';

const Navbar = () => {
    const location = useLocation();
    let isNavbarVisible = false;
    const navbarVisibilityRoutes = ['/auth', '/hotel', '/room', '/user'];

    navbarVisibilityRoutes.forEach((route) => {
        if (location.pathname.includes(route)) {
            isNavbarVisible = true;
        }
    });


    if (!isNavbarVisible && location.pathname !== '/') return <></>;
    return (

        <div className='fixed w-full bg-white z-10 shadow-sm'>
            <div className='py-4 border-b-[1px]'>

                <Container>
                    <div className='flex flex-row item-center justify-between gap-3 md:gap-0'>
                        <Logo />
                        <Search />
                        <UserMenu />
                    </div>
                </Container>

            </div>
        </div>
    );
};

export default Navbar;