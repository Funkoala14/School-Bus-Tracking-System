import BackTitle from '@components/BackTitle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
const View = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const list = [
        {
            id: 1,
            name: 'Username',
        },
        {
            id: 2,
            name: 'First name',
        },
        {
            id: 3,
            name: 'Last name',
        },
        {
            id: 4,
            name: 'Email',
        },
        {
            id: 5,
            name: 'phone number',
        },
        {
            id: 6,
            name: 'driver license',
        },
        {
            id: 7,
            name: 'license expire date',
        }
    ];

    console.log(location, id, 'id');

    const editHandler = () => {
        navigate(`/driver/profile/edit?id=${id}`);
    };

    return (
        <div className='p-2'>
            <BackTitle title='Profile' />
            <div>
                <div>
                    {list.map((item) => (
                        <div className='mt-2 ' key={item.id}>
                            <span className='flex-1 font-bold'>{item.name}：</span>
                            <span className='w-full break-all'>
                                value
                            </span>
                        </div>
                    ))}
                </div>
                <div className='mt-4'>
                    <div></div>
                    <div className='flex gap-2'>
                        <Button variant='outlined' color='primary' startIcon={<EditNoteIcon color='primary' />} onClick={editHandler}>Edit</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;