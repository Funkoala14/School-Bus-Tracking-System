import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../../store/notificationSlice/notification.slice';

export const NotificationSnackbar = ({duration = 3000}) => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state) => state.notification);

    const handleClose = (event, reason) => {
        dispatch(clearNotification());
    };

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [open, dispatch]);

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={duration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '70%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
