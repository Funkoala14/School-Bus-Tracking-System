import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

export default function OutlinedTimeline(props) {
    const { child } = props;
    return (
        <div className='p-4 pt-0'>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography
                            variant=''
                            component={'div'}
                            color={'#828282'}
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            Name
                        </Typography>
                        <Typography
                            variant='span'
                            color='#0F3D65'
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            {child.firstName} {child.lastName}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography
                            variant=''
                            component={'div'}
                            color={'#828282'}
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            Student ID
                        </Typography>
                        <Typography
                            variant='span'
                            color='#0F3D65'
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            {child.studentId}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography
                            variant=''
                            component={'div'}
                            color={'#828282'}
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            School
                        </Typography>
                        <Typography
                            variant='span'
                            color='#0F3D65'
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            {child?.school?.name}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography
                            variant=''
                            component={'div'}
                            color={'#828282'}
                            sx={{
                                fontSize: '18px',
                            }}
                        >
                            Routes
                        </Typography>
                        {child?.route.length &&
                            child?.route.map((route) => (
                                <Typography
                                    variant='span'
                                    color='#0F3D65'
                                    sx={{
                                        fontSize: '18px',
                                    }}
                                    key={route._id}
                                >
                                    {route.name}
                                </Typography>
                            ))}
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </div>
    );
}