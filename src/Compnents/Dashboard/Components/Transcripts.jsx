import React from 'react';
import {
    Stack,
    Typography,
    Box,
    Divider,
    TextField,
    Button
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Transcripts = () => {
    const reportData = [
        { label: "Blood Pressure", value: "120/80 mmHg" },
        { label: "Heart Rate", value: "72 bpm" },
        { label: "Blood Sugar", value: "90 mg/dL" },
        { label: "Cholesterol", value: "180 mg/dL" },
        { label: "Body Temperature", value: "98.6 °F" },
    ];
const handleFeedback=()=>{
    toast.success("Feedback submitted. Thank you!")
}
    return (
       <>
        <Box
            sx={{
                width: 600,
                padding: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid #D0D5DD',
                mx: 'auto',
                my: 3,
            }}
        >
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#344054', fontSize: "18px", fontWeight: 600 }}>
                    Report 
                </Typography>
                <Typography variant="body2" sx={{ color: '#667085', fontSize: "14px" }}>
                    Patient's vital statistics and recent test results.
                </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box>
                {reportData.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            p: 2,
                            bgcolor: '#F8F8FD',
                            border: '1px solid #D6DDEB',
                            borderRadius: 2,
                        }}
                    >
                        <Typography sx={{ fontWeight: 500, color: "#515B6F" }}>{item.label}:</Typography>
                        <Typography sx={{ fontWeight: 600, color: "#344054" }}>{item.value}</Typography>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ color: '#667085', mb: 1 }}>
               Make a  Feedback
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Provide feedback on the report"
                multiline
                rows={2}
                sx={{
                    borderRadius: '8px',
                    backgroundColor: '#F7F7F7',
                    border: '1px solid #D0D5DD',
                    color: '#515B6F',
                    mb: 2
                }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                {/* <Button variant="outlined" sx={{ color: "#344054", borderColor: "#D0D5DD" }}>
                    Cancel
                </Button> */}
                <Button variant="contained" sx={{ color: "#FFF", backgroundColor: "#1976d2" }} onClick={handleFeedback}>
                    Submit Feedback
                </Button>
            </Stack>
        </Box>
        <ToastContainer />
        </>
    );
};

export default Transcripts;
