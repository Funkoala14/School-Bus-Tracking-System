import React, { useEffect } from 'react'; // 添加 useEffect 的导入
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Stack,
    Paper,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import BackTitle from '@components/BackTitle'; // 保留后退标题功能
import { deleteParent } from '../../store/parentSlice/parent.thunk'; // 家长删除接口
import { setTitle } from '../../store/titleSlice'; // 设置标题

const View = () => {
    const navigate = useNavigate(); // 用于页面跳转
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams(); // 获取 URL 参数
    const parentId = searchParams.get('id'); // 从 URL 中获取家长 ID
    const parent = useSelector(
        (state) => state.parent.parentList.find((p) => p._id === parentId) // 从 Redux 中找到对应家长
    );

    useEffect(() => {
        // 设置页面标题和后退功能
        dispatch(setTitle({ title: 'Parent Management', ifBack: true }));
    }, [dispatch]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this parent?')) {
            // 调用删除接口, 并在成功后返回列表页面
            dispatch(deleteParent(parentId)).then(() => navigate('/admin/parent-management'));
        }
    };

    const deleteHandler = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitHandler = () => {
        // Handle deletion logic here
        setOpen(false);
    };

    useEffect(() => {
        dispatch(setTitle({ title: 'View Parent', ifBack: true }));
    }, [dispatch]);

    if (!parent) return <p>Parent not found</p>; // 如果家长信息未找到, 显示提示

    return (
        <Stack spacing={1} p={1}>
            <Typography variant='h5'>
                {parent.firstName} {parent.lastName}
            </Typography>
            <Typography variant='body1'>
                <strong>Phone:</strong> {parent.phone}
            </Typography>
            <Typography variant='body1'>
                <strong>Email:</strong> {parent.email}
            </Typography>
            {/* 渲染子女信息 */}
            {parent?.children?.length > 0 ? (
                <TableContainer component={Paper} className='mt-4'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>First Name</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Last Name</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Student ID</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parent.children.map((item) => (
                                <TableRow key={item?.studentId}>
                                    <TableCell>{item?.firstName}</TableCell>
                                    <TableCell>{item?.lastName}</TableCell>
                                    <TableCell>{item?.studentId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant='body2' className='mt-4'>
                    No children information available.
                </Typography>
            )}
            <Button
                variant='outlined'
                startIcon={<EditNoteIcon />}
                onClick={() => navigate(`/admin/parent-management/edit?id=${parent._id}`)} // 跳转到编辑页面
            >
                Edit
            </Button>
            <Button variant='outlined' startIcon={<DeleteIcon />} color='error' onClick={handleDelete}>
                Delete
            </Button>
        </Stack>
    );
};

export default View;
