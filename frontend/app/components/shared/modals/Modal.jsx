'use client';

import { useCallback, useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit, title, body, footer, actionLabel, disabled, secondaryAction, secondaryLabel }) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleOnClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [disabled, onClose]);

    const handleOnSubmit = useCallback(() => {
        if (disabled) return;

        onSubmit();

    }, [disabled, onSubmit]);


    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) return;

        secondaryAction();


    }, [disabled, secondaryAction]);


    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">

            </div>
        </>
    );
}

export default Modal