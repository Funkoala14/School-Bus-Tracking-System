import BackTitle from '@components/BackTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { random } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Detail = () => {
    const dispatch = useDispatch();

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

     useEffect(() => {
         dispatch(setTitle({ title: 'Route Schedule', ifBack: false }));

         return () => {
             dispatch(setTitle({ title: '', ifBack: false }));
         };
     }, [dispatch]);

    return <div className='py-2 px-4'>
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
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>;
};

export default Detail;
