import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
export default function OutlinedTimeline() {

    const timeLineList = [
        {
            title: "School",
            content: "Flagg Street School",
            address: "115 Flagg St, Worcester, MA 01602",
        },
        {
            title: "Student Name",
            content: "Rachel",
        },
        {
            title: "Contract Details",
            content: "774-920-9200",
        },
        {
            title: "Pick-Up/Drop-off Location",
            content: "Royal Worcester Apartments, 45 Grand St, Worcester, MA 01610",
        }
    ]

    const active = 0;

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
                {
                    timeLineList.map((item, index) => {
                        return (
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineDot variant="outlined" />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography variant="" component={"div"} color={index === active ? "primary" : "#828282"} sx={{
                                        fontSize: index === active ? "20px" : "18px",
                                    }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="span" color="#0F3D65" sx={{
                                        fontSize: "18px",
                                    }}>
                                        {item.content}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        )
                    })
                }
            </Timeline>
        </div >
    );
}