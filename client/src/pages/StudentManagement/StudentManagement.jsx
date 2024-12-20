import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { studentListThunk } from '../../store/adminSlice/admin.thunk';
import { selectStudent } from '../../store/adminSlice/admin.slice';
import { setTitle } from '../../store/titleSlice';

const StudentManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { studentList } = useSelector((state) => state.admin);

    const studentView = (item) => {
        dispatch(selectStudent(item));
        navigate(`/admin/student-management/view?id=${item._id}`);
        console.log('studentView:', `/admin/student-management/view?id=${item._id}`);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'Student Management', ifBack: false }));
        dispatch(studentListThunk());
    }, [dispatch]);

    return (
        <div className='p-2'>
            {/* <SearchInputBase placeholder='Search student' /> */}

            <div className='mt-2 grid grid-cols-1 gap-4'>
                {studentList.map((student) => (
                    <div key={student._id} className='col-span-3' onClick={() => studentView(student)}>
                        <Card>
                            <CardContent>
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {student.firstName} {student.lastName}
                                </Typography>
                                <Typography variant='body2' className='mt-2'>
                                    <span className='font-bold'>Student ID: </span>
                                    {student.studentId}
                                </Typography>
                                {student.parent && (
                                    <Typography variant='body2' className='mt-2'>
                                        <span className="font-bold">Parent: </span>
                                        {student.parent.firstName} {student.parent.lastName}
                                    </Typography>
                                )}
                                {/* {student.address && (
                                    <Typography variant='body2' className='mt-2'>
                                        Address: {student.address.address}
                                    </Typography>
                                )} */}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            <SpeedDial
                ariaLabel='SpeedDial openIcon example'
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon sx={{ color: 'white' }} />}
                translate='none'
                onClick={() => {
                    navigate('/admin/student-management/edit');
                }}
            ></SpeedDial>
        </div>
    );
};

export default StudentManagement;
