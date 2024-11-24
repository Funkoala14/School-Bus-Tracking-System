import BackTitle from '@components/BackTitle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDriverInfo } from '../../store/driverSlice/driver.thunk';
import { setTitle } from '../../store/titleSlice';
import { formatDate } from '../../assets/publicUtils';
const View = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { info } = useSelector((state) => state.driver);

    const editHandler = () => {
        navigate('/driver/profile/edit');
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Profile', ifBack: false }));
        dispatch(getDriverInfo());
    }, [dispatch]);
    return (
        <div className='p-2 flex flex-col gap-3'>
            <div className='view-container'>
                <label className='view-item'>
                    First Name
                    <span>{info?.firstName}</span>
                </label>
                <label className='view-item'>
                    Last Name
                    <span>{info?.lastName}</span>
                </label>
                <label className='view-item'>
                    License
                    <span>{info?.license}</span>
                </label>
                <label className='view-item'>
                    License Expiry Data
                    <span>{formatDate(info?.licenseExpiry)}</span>
                </label>
                <label className='view-item'>
                    Phone
                    <span>{info?.phone}</span>
                </label>
                <label className='view-item'>
                    Email
                    <span>{info?.email}</span>
                </label>
            </div>
            <Button variant='outlined' color='primary' startIcon={<EditNoteIcon color='primary' />} onClick={editHandler}>
                Edit
            </Button>
        </div>
    );
};

export default View;