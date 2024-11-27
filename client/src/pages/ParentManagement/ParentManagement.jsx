import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchInputBase from '@components/SearchInputBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { setTitle } from '../../store/titleSlice';
import { fetchParents } from '../../store/parentSlice/parent.thunk';

const ParentManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { parentList } = useSelector((state) => state.parent);

    useEffect(() => {
        // 设置页面标题，不启用后退功能
        dispatch(setTitle({ title: 'Parent Management', ifBack: false }));
        dispatch(fetchParents());
    }, [dispatch]);

    const visibilityHandler = (item) => {
        navigate(`/admin/parent-management/view?id=${item._id}`);
    };

    useEffect(()=> {
        dispatch(setTitle({ title: 'Parent Management', ifBack: false }));
    },[dispatch])

    return (
        <div className="p-2">
            {/* <SearchInputBase placeholder="Search parent" /> */}

            <div className="mt-2 grid grid-cols-1 gap-4">
                {Array.isArray(parentList) &&
                    parentList.map((parent) => (
                        <div
                            key={parent._id}
                            className="col-span-3"
                            onClick={() => visibilityHandler(parent)}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        parentName: {parent.firstName} {parent.lastName}
                                    </Typography>
                                    <Typography variant="body2" className="mt-2">
                                        phone: {parent.phone}
                                    </Typography>
                                    <Typography variant="body2" className="mt-2">
                                        email: {parent.email}
                                    </Typography>
                                    {parent?.children &&
                                        parent?.children.map((item) => (
                                            <Typography
                                                key={item?.studentId}
                                                variant="body2"
                                                className="mt-2"
                                            >
                                                {`childrenName&id: ${item?.firstName} ${item?.lastName} (${item?.studentId})`}
                                            </Typography>
                                        ))}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
            </div>
            <SpeedDial
                ariaLabel="Add Parent"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon sx={{ color: 'white' }} />}
                onClick={() => navigate('/admin/parent-management/edit')}
            />
        </div>
    );
};

export default ParentManagement;



