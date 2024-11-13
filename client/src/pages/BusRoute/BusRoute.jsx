import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { random } from 'lodash';
import BackTitle from '@components/BackTitle';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const BusRoute = () => {
    const [open, setOpen] = useState(false);
    const notStudent = true;
    const notRoute = true;

    if (!notStudent || !notRoute) {
        return <div className='py-2 px-4 h-full flex flex-col justify-center items-center'>
            <div className='w-40 h-40 flex justify-center items-center bg-gray-200 '>
                这里应该有一张图片
            </div>
            <div className='text-lg font-bold mt-4'>Please add student/route.</div>
        </div>;
    }

    const columns = [
        {
            id: 'bus',
            label: 'license plate number',
            minWidth: 170,
            format: (value) => value.toLocaleString('en-US'),
            align: 'center',
        },
        ...Array.from({ length: 10 }, (_, index) => index + 1).map((item) => ({
            id: 'bus' + item,
            label: item == 1 ? 'start' : item == 10 ? 'end' : 'site--' + item,
            align: 'right',
            minWidth: 170,
            format: (value) => value.toLocaleString('en-US'),
        }))
    ]

    const rows = Array.from({ length: 10 }, (_, index) => index + 1).map(el => createData('bus' + el, 'bus' + el, 100, 100))

    function createData(name, code) {
        const obj = {}
        Array.from({ length: 10 }, (_, index) => index + 1).forEach(el => {
            obj[`bus${el}`] = dayjs().add(random(1, 20), 'minute').format('HH:mm')
        })
        return {
            ...obj,
            name,
            code,
            bus: 'ABCDEFG'
        }
    }

    const [detailItem, setDetailItem] = useState(null);
    const detailHandler = (item) => {
        setOpen(true);
        setDetailItem(item);
    }

    const closeHandler = () => {
        setOpen(false);
        setDetailItem(null);
    }

    const list = [
        {
            id: 1,
            name: 'Username',
        },
        {
            id: 6,
            name: 'driver license',
        },
        {
            id: 7,
            name: 'license expire date',
        },
        {
            id: 5,
            name: 'phone number',
        },
    ];

    return <div className='py-2 px-4'>
        <BackTitle title="Route" />
        <div className='mt-4'>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                key='action'
                                align='center'
                                style={{ minWidth: 170 }}
                            >
                                Driver
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell
                                            key='action'
                                            align='center'
                                            style={{ minWidth: 170 }}
                                        >
                                            <Button variant="text" onClick={() => { detailHandler(row) }} color="primary">
                                                Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <Dialog
            open={open}
            onClose={closeHandler}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Driver Detail
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
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
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeHandler}>Disagree</Button>
            </DialogActions>
        </Dialog>
    </div>;
}

export default BusRoute