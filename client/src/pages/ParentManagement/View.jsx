import React, { useEffect } from 'react'; // 添加 useEffect 的导入
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardActions, Button } from '@mui/material';
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
    const parent = useSelector((state) =>
        state.parent.parentList.find((p) => p._id === parentId) // 从 Redux 中找到对应家长
    );

    useEffect(() => {
        // 设置页面标题和后退功能
        dispatch(setTitle({ title: 'Parent Management', ifBack: true }));
    }, [dispatch]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this parent?')) {
            // 调用删除接口，并在成功后返回列表页面
            dispatch(deleteParent(parentId)).then(() => navigate('/admin/parent-management'));
        }
    };

<<<<<<< Updated upstream
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
=======
    if (!parent) return <p>Parent not found</p>; // 如果家长信息未找到，显示提示
>>>>>>> Stashed changes

    return (
        <div className="p-2">
            <BackTitle /> {/* 保留后退标题 */}
            <Card>
                <CardContent>
                    <h2>
                        {parent.firstName} {parent.lastName}
                    </h2>
                    <p>Phone: {parent.phone}</p>
                    <p>Email: {parent.email}</p>
                    {/* 渲染子女信息 */}
                    {parent?.children &&
                        parent?.children.map((item) => (
                            <p key={item?.studentId}>
                                {'childrenName&id:'} {item?.firstName} {item?.lastName} ({item?.studentId})
                            </p>
                        ))}
                </CardContent>
                <CardActions>
                    <Button
                        startIcon={<EditNoteIcon />}
                        onClick={() => navigate(`/admin/parent-management/edit?id=${parent._id}`)} // 跳转到编辑页面
                    >
                        Edit
                    </Button>
                    <Button startIcon={<DeleteIcon />} color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
};

export default View;

