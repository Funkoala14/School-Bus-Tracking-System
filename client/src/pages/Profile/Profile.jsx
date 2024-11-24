
import React, { useEffect } from 'react';
import { Box, Grid2, Typography, Avatar } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CircularProgressWithLabel from './components/CircularProgressWithLabel';
import UserInfo from './components/UserInfo';
import TimeLine from './components/TimeLine';
import { useDispatch, useSelector } from 'react-redux';
import { getChildInfoThunk } from '../../store/parentSlice/parent.thunk';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { childInfo } = useSelector((state) => state.parent);
    const { userName } = useSelector((state) => state.auth);
    
    // const goBack = () => {
    //     navigate(-1);
    // };

    const goEditProfile = () => {
        navigate('/parent/profile/edit');
    }

    useEffect(() => {
        dispatch(getChildInfoThunk());
    }, [dispatch]);

    return (
        <div className='h-full w-full'>
            <div className='h-1/2 w-full bg-[#0F3D65] p-8'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid2 container spacing={2} justifyContent={'center'} alignItems={'center'}>
                        <Grid2 size={4}>
                            {/* <KeyboardBackspaceIcon
                                sx={{
                                    fontSize: 40,
                                    cursor: 'pointer',
                                    color: 'white',
                                }}
                                onClick={goBack}
                            /> */}
                        </Grid2>
                        <Grid2 size={4} textAlign={'center'}>
                            <Typography variant='span' fontSize={30} fontWeight={200} color='white'>
                                Profile
                            </Typography>
                        </Grid2>
                        <Grid2 size={4}></Grid2>
                        <Grid2 size={4} textAlign={'center'}>
                            <span className='p-2 inline-block rounded-full bg-[#25598E]'>
                                <EditNoteOutlinedIcon
                                    sx={{
                                        fontSize: 40,
                                        cursor: 'pointer',
                                        color: 'white',
                                        position: 'relative',
                                        left: 4,
                                    }}
                                    onClick={goEditProfile}
                                />
                            </span>
                        </Grid2>
                        <Grid2 size={4} textAlign={'center'}>
                            <Avatar
                                sx={{
                                    display: 'inline-block',
                                    width: '100px',
                                    height: '100px',
                                }}
                                alt='Cindy Baker'
                                src='https://resources.finalsite.net/images/f_auto,q_auto/v1719506525/hiesorg/t5zlluckjrp4auyqpyzu/LSProfilePic.jpg'
                            />
                        </Grid2>
                        <Grid2 size={4}>
                            {/* <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                            }}
                        >
                            <CircularProgressWithLabel value={74} />
                        </Box> */}
                        </Grid2>
                        <Grid2 size={12} textAlign={'center'}>
                            <Typography variant='span' fontSize={30} fontWeight={200} color='white'>
                                {userName}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </Box>
            </div>
            {/* <div>
                <UserInfo />
            </div> */}
            {childInfo.length &&
                childInfo.map((child) => (
                    <React.Fragment key={child.studentId}>
                        <TimeLine child={child} />
                    </React.Fragment>
                ))}
        </div>
    );
};
export default Profile