import { useNavigate } from 'react-router-dom';
import Image from '../primitives/Image';

const Logo = () => {
    const navigate = useNavigate();
    return <Image onClick={() => navigate('/')} alt="Logo" className="hidden md:block cursor-pointer" height={100} width={100} src="/images/logo.png" />
};

export default Logo;
