import { useSelector } from "react-redux";
import Image from "../../primitives/Image";

const Avatar = () => {
    const { user } = useSelector((state) => state.persistedAuthReducer);

    return (
        <Image className="rounded-full" height='30' width='30' alt="Avatar" src={`${user?.avatar ? user.avatar : '/images/avatar.png'}`} />
    );
};

export default Avatar;