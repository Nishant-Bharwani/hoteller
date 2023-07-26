const MenuItem = ({ onClick, label }) => {
    return (
        <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-400 transition font-semibold">
            {label}
        </div>
    )
}

export default MenuItem;