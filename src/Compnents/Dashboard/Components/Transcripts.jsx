// Transcripts.js
import React, { useState, useEffect } from 'react';
import {
    Stack,
    Typography,
    Box,
    Divider,
    TextField,
    Button,
    CircularProgress,
    Grid
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useParams } from 'react-router-dom'; // Importing useParams

const Transcripts = () => {
    const { docId } = useParams();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackError, setFeedbackError] = useState(false);

    const [editedValues, setEditedValues] = useState({});

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

    // Fetch report data from Firestore
    useEffect(() => {
        if (docId) {
            handleGetReportData(docId);
        }
    }, [docId]);

    const handleGetReportData = async (documentName) => {
        try {
            const updateDocumentName = documentName ? documentName.split('-')[1] : null;

            setLoading(true);
            const docRef = doc(db, 'biomarker_data', updateDocumentName);
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

    // Handle change in value or unit
    const handleEditChange = (index, field, newValue) => {
        const updatedValues = { ...editedValues };
        updatedValues[index] = updatedValues[index] || {};
        updatedValues[index][field] = newValue;
        setEditedValues(updatedValues);
    };

    const handleEditReport = async () => {
        try {
            console.log('Editing document with docId:', docId);

            setLoading(true);

            const updateDocumentName = docId ? docId.split('-')[1] : null;

            if (!updateDocumentName) {
                throw new Error("Invalid document ID.");
            }

            const updatedReportData = reportData.map((dataItem, index) => {
                if (editedValues[index]) {
                    return {
                        ...dataItem,
                        value: {
                            data: {
                                ...dataItem.value.data,
                                value: editedValues[index].value || dataItem.value.data.value,
                                unit: editedValues[index].unit || dataItem.value.data.unit
                            }
                        }
                    };
                }
                return dataItem;
            });

            // Log the updatedReportData to ensure it's correct
            console.log('Updated report data:', updatedReportData);

            const docRef = doc(db, 'biomarker_data', updateDocumentName);  // Reference to the correct document

            // Check if the document exists before trying to update
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                throw new Error("Document does not exist.");
            }

            await updateDoc(docRef, {
                biomarkers: updatedReportData,  // Update biomarkers
            });

            toast.success("Report updated successfully!");
            setLoading(false);
        } catch (error) {
            console.error("Error updating document:", error);
            toast.error(error.message || "Failed to update report.");
            setLoading(false);
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
                                    <Grid container spacing={2}>
                                    <Grid item xs={12} key={index}>
                                            <Typography sx={{ fontWeight: 500, color: "#515B6F" }}>
                                                {dataItem.displayName}:
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} key={index}>
                                        <TextField
                                            sx={{ width: 150, mr: 2 }}
                                            value={editedValues[index]?.value || dataItem.value.data.value}
                                            onChange={(e) => handleEditChange(index, 'value', e.target.value)}
                                            size="small"
                                            variant="outlined"
                                            label="Value"
                                        />
                                    </Grid>
                                    <Grid item xs={12} key={index}>
                                        <TextField
                                            sx={{ width: 100 }}
                                            value={editedValues[index]?.unit || dataItem.value.data.unit}
                                            onChange={(e) => handleEditChange(index, 'unit', e.target.value)}
                                            size="small"
                                            variant="outlined"
                                            label="Unit"
                                        />
                                    </Grid>
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

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    sx={{ color: "#FFF", backgroundColor: "#1976d2" }}
                    onClick={handleEditReport} 
                >
                    Save Changes
                </Button>
                </Stack>
            </Box>
            <ToastContainer />
        </>
    );
};

export default Transcripts;
