
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2';

const UserInfo = () => {
    const list = [
        {
            title: 'Grade',
            value: 'First Grade'
        },
        {
            title: 'Parent Name',
            value: 'Jason Smith'
        },
        {
            title: 'Gender',
            value: 'Female'
        },
        {
            title: 'Age',
            value: '6 yrs old'
        }
    ];

    return (
        <div className='p-8'>
            <Card sx={{
                position: 'relative',
                padding: 0,
                paddingBottom: 0,
                "&::before": {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#e5e5e5',
                    transform: 'translateY(-50%)'
                },
                "&::after": {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: "50%",
                    width: '1px',
                    height: '100%',
                    backgroundColor: '#e5e5e5',
                    transform: 'translateX(-50%)'
                }
            }}>
                <CardContent sx={{
                    padding: 0,
                    paddingBottom: '0 !important',
                }}>
                    <Grid2 container justifyContent={'center'} alignItems={'center'}>
                        {list.map((item, index) => (
                            <Grid2 item size={6} key={index}>
                                <div className='flex h-full justify-center items-center text-center p-3'>
                                    <div className='flex-1'>
                                        <Typography variant="span" color='primary' sx={{
                                            fontWeight: '300',
                                            fontSize: 24,
                                            marginTop: 2,
                                            display: 'inline-block',
                                        }}>
                                            {item.value}
                                        </Typography>
                                        <Typography variant="span" sx={{
                                            fontWeight: '700',
                                            fontSize: 18,
                                            marginTop: 1,
                                            color: '#000000',
                                        }} component={"div"}>
                                            {item.title}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid2>
                        ))}
                    </Grid2>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserInfo;