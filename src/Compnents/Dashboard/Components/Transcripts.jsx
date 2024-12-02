import React, { useState, useEffect } from 'react';
import {
    Stack,
    Typography,
    Box,
    Divider,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';  
import { db } from './firebaseConfig'; 

const Transcripts = ({ setSelected }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackError, setFeedbackError] = useState(false);

    const handleFeedback = () => {
        if (!feedback.trim()) {
            setFeedbackError(true); 
            return;
        }
        setLoading(true);
        setTimeout(() => {
            toast.success("Feedback submitted. Thank you!");
            setFeedback('');
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        const selectedDocument = localStorage.getItem('selectedDocument');
        const documentName = selectedDocument ? selectedDocument.split('-')[1] : null;
        
        setSelectedFile(documentName);
        console.log(documentName);
        if (documentName) {
            handleGetReportData(documentName); 
        }
    }, []);

    const handleGetReportData = async (documentName) => {
        try {
            setLoading(true);
            const docRef = doc(db, 'biomarker_data', documentName);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const biomarkerData = snapshot.data();
                setReportData(biomarkerData.biomarkers);
                setLoading(false);
            } else {
                console.log("No such document!");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            setLoading(false);
            toast.error("Failed to load report data.");
        }
    };

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

                {!loading ? (
                    reportData.length > 0 ? (
                        <Box>
                            {reportData.map((dataItem, index) => (
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
                                    <Typography sx={{ fontWeight: 500, color: "#515B6F" }}>
                                        {dataItem.displayName}:
                                    </Typography>
                                    <Typography sx={{ fontWeight: 600, color: "#344054" }}>
                                        {dataItem.value.data.value} {dataItem.value.data.unit}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', my: 5 }}>
                            <Typography variant="h6" sx={{ color: '#344054', mb: 3 }}>
                                No report data available.
                            </Typography>
                        </Box>
                    )
                ) : (
                    <Box sx={{ textAlign: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" sx={{ color: '#667085', mb: 1 }}>
                    Make a Feedback
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Provide feedback on the report"
                    multiline
                    rows={2}
                    value={feedback}
                    onChange={(e) => {
                        setFeedback(e.target.value);
                        setFeedbackError(false);
                    }}
                    error={feedbackError}
                    helperText={feedbackError && "Feedback cannot be empty."}
                    sx={{
                        borderRadius: '8px',
                        backgroundColor: '#F7F7F7',
                        border: '1px solid #D0D5DD',
                        color: '#515B6F',
                        mb: 2
                    }}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        sx={{ color: "#FFF", backgroundColor: "#1976d2" }}
                        onClick={handleFeedback}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </Stack>
            </Box>
            <ToastContainer />
        </>
    );
};

export default Transcripts;
