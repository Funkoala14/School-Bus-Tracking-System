import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackTitle from '@components/BackTitle';
import { useState } from 'react';
const Notification = () => {
    const list = [
        {
            title: 'Notification 1',
            description: 'Description 1',
            time: '10:00 AM',
            id: 1,
        },
        {
            title: 'Notification 2',
            description: 'Description 2',
            time: '10:00 AM',
            id: 2,
        },
        {
            title: 'Notification 3',
            description: 'Description 3',
            time: '10:00 AM',
            id: 3,
        },
        {
            title: 'Notification 4',
            description: 'Description 4',
            time: '10:00 AM',
            id: 4,
        },
    ]
    const [expanded, setExpanded] = useState(false);

    const handleChange =
        (panel) => (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false);
        };
    return <div className='px-4 py-2'>
        <BackTitle title='Notification' />
        <div className='mt-4'>
            {
                list.map((item) => (
                    <Accordion key={item.id} expanded={expanded === item.id} onChange={handleChange(item.id)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${item.id}-content`} id={`${item.id}-header`}>
                            <Typography>{item.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography className='text-sm'>
                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue.
                            </Typography>
                            <Typography className='text-xs text-gray-500'>
                                {item.time}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div>
    </div>;
};

export default Notification;
