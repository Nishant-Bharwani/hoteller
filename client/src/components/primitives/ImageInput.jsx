import { useRef, useState } from 'react';
import { TbPhotoPlus } from 'react-icons/tb';
import Image from './Image';

const ImageInput = ({ type = "file", id, label, multiple, disabled, required, register }) => {
    // return (
    //     <div className="w-full relative">
    //         <label className="block mb-2 text-sm font-medium text-neutral-500" htmlFor={id}>{label}</label>
    //         <input className="block w-full text-sm text-sky-500 border border-gray-300 rounded-lg cursor-pointer bg-sky-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id={id} type={type} multiple={multiple} accept={`${multiple ? 'image/*' : ''}`} disabled={disabled} {...register(id, { required })} />
    //     </div>
    // );
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    }

    return (
        <div onClick={handleClick} htmlFor={id} className={`relative cursor-pointer hover:opacity-70 transition border-dashed border-2 ${selectedImage ? 'p-4' : 'p-20'} border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`}>
            {!selectedImage && <TbPhotoPlus size={40} />}

            {!selectedImage && <div className='font-semibold text-lg'>{label}</div>}
            {/* <input ref={inputRef} className="block w-full text-sm text-sky-500 border border-gray-300 rounded-lg cursor-pointer bg-sky-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id={id} type={type} multiple={multiple} accept={`${multiple ? 'image/*' : ''}`} disabled={disabled} {...register(id, { required })} style={{ visibility: 'hidden' }} /> */}
            <input
                ref={inputRef}
                className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                id={id}
                type={type}
                multiple={multiple}
                accept={`${multiple ? 'image/*' : ''}`}
                disabled={disabled}
                {...register(id, { required })}
                onChange={handleImageChange}
            />
            {selectedImage && <Image alt="Upload avatar" fill="true" style={{ objectFit: 'cover' }} src={selectedImage} />}
        </div>
    );
};



export default ImageInput;

