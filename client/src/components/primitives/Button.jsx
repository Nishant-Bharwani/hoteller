import { BeatLoader } from "react-spinners";
const Button = ({ label, onClick, disabled, outline, small, icon: Icon, isLoading }) => {
    return (
        <button onClick={onClick} disabled={disabled} className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 w-full transition
         ${outline ? 'bg-white' : 'bg-sky-500'}
         ${outline ? 'border-black' : 'border-sky-500'}
         ${outline ? 'text-black' : 'text-white'}
         ${small ? 'py-1' : 'py-3'}
         ${small ? 'text-sm' : 'text-md'}
         ${small ? 'font-light' : 'font-semibold'}
         ${small ? 'border-[1px]' : 'border-2'}
         `}>
            {Icon && <Icon size={24} className='absolute left-4 top-3' />}

            <span className="flex flex-row gap-2 items-center justify-center">
                {label}
                {isLoading && <BeatLoader size={10} color="#fff" />}
            </span>
        </button>
    );
};

export default Button;