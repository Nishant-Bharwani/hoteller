const ImageInput = ({ type = "file", id, label, multiple, disabled, required, register }) => {
    return (
        <div class="w-full relative">
            <label class="block mb-2 text-sm font-medium text-neutral-500" for={id}>{label}</label>
            <input class="block w-full text-sm text-sky-500 border border-gray-300 rounded-lg cursor-pointer bg-sky-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id={id} type={type} multiple={multiple} accept={`${multiple ? 'image/*' : ''}`} disabled={disabled} {...register(id, { required })} />
        </div>
    );
};

export default ImageInput;