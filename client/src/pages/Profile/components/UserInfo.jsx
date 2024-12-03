import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';

const UserInfo = () => {
    const { profile } = useSelector((state) => state.parent);

    return (
        <Stack p={2} spacing={1} direction={'row'} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Stack direction={'column'} m={1}>
                <Typography
                    variant=''
                    component={'div'}
                    color={'#828282'}
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    Full Name
                </Typography>
                <Typography
                    variant='span'
                    color='#0F3D65'
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    {profile.firstName} {profile.lastName}
                </Typography>
            </Stack>

            <Stack direction={'column'} m={1}>
                <Typography
                    variant=''
                    component={'div'}
                    color={'#828282'}
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    Phone
                </Typography>
                <Typography
                    variant='span'
                    color='#0F3D65'
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    {profile.phone}
                </Typography>
            </Stack>
            <Stack direction={'column'} m={1}>
                <Typography
                    variant=''
                    component={'div'}
                    color={'#828282'}
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    Email
                </Typography>
                <Typography
                    variant='span'
                    color='#0F3D65'
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    {profile.email}
                </Typography>
            </Stack>
            <Stack direction={'column'} m={1}>
                <Typography
                    variant=''
                    component={'div'}
                    color={'#828282'}
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    Address
                </Typography>
                <Typography
                    variant='span'
                    color='#0F3D65'
                    sx={{
                        fontSize: '18px',
                    }}
                >
                    {profile?.address?.address}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default UserInfo;
