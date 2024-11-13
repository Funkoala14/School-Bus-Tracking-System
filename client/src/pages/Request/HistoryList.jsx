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



const HistoryList = () => {
    const columns = [
        {
            id: 'name',
            label: 'request name',
            minWidth: 170,
            align: 'center',
        },
        {
            id: "date",
            label: 'request date',
            minWidth: 170,
            align: 'center',
        },
        {
            id: "time",
            label: 'request time',
            minWidth: 170,
            align: 'center',
        },
        {
            id: "status",
            label: 'status',
            minWidth: 170,
            align: 'center',
        }
    ]

    const rows = [
        {
            name: 'request name1',
            date: dayjs().format('DD/MM/YYYY'),
            time: dayjs().format('HH:mm'),
            status: 'pending'
        },
        {
            name: 'request name2',
            date: dayjs().format('DD/MM/YYYY'),
            time: dayjs().format('HH:mm'),
            status: 'success'
        },
        {
            name: 'request name3',
            date: dayjs().format('DD/MM/YYYY'),
            time: dayjs().format('HH:mm'),
            status: 'failed'
        }
    ]

    return <div className='py-2 px-4'>
        <BackTitle title="Request History List" />
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

export default HistoryList;