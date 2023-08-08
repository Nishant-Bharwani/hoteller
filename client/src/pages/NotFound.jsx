import React from 'react';
import EmptyState from '../components/shared/EmptyState';

const NotFound = () => {
    return (
        <div className='h-[70vh] flex flex-col justify-center items-center'>
            <EmptyState title="This page does not exists" subtitle="Looks like the page you requested does not exists!" showReset showResetLabel='Go back to Home page' />
        </div>
    );
}

export default NotFound;