import BackTitle from '@components/BackTitle';
import MapComponent from '../../components/MapComponent';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
const Route = () => {
    const [name, setName] = useState('');

    const list = [
        {
            name: 'Student 1',
            id: 1,
        },
        {
            name: 'Student 2',
            id: 2,
        },
        {
            name: 'Student 3',
            id: 3,
        },
    ]

    const handleChange = (e) => {
        setName(e.target.value);
    }

    return <div className='px-4 py-2 w-full h-full'>
        <BackTitle title='Edit Route' />
        <div className='my-4'>
            <FormControl className='w-full'>
                <InputLabel id="demo-simple-select-autowidth-label">Select Student</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={name}
                    onChange={handleChange}
                    label="Select Student"
                    color='primary'
                    variant='outlined'
                    className='w-full'
                >
                    {
                        list.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
        <MapComponent className='!h-3/5' />
    </div>;
};

export default Route;