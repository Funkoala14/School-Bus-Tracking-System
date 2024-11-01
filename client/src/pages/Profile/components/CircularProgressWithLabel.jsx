import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            {/* CircularProgress for the progress bar */}
            <CircularProgress
                variant="determinate"
                value={props.value}
                size={56} // 调整大小
                thickness={1} // 设定进度条的粗细
                sx={{
                    color: '#00E0A1', // 自定义颜色
                    backgroundColor: '#25598E', // 自定义背景颜色
                    borderRadius: '50%', // 圆形进度条
                }}
            />
            {/* Typography to display percentage in the center */}
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontSize: '16px', fontWeight: '200', color: '#fff' }} // 自定义文本样式
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel;