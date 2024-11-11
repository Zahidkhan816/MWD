import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Typography,
    Paper,
    LinearProgress,
    IconButton,
    Grid,
} from '@mui/material';
import DellIcon from './Assets/deleteIcon2.png'
import UplaodIcon from './Assets/UploadIcon2.png'
const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            progress: 0,
        }));
        setFiles(newFiles);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleDelete = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        setUploadProgress(0);
    };

    return (
        <>

            <Grid container rowSpacing={2} columnSpacing={{ xs: 5, sm: 5, md: 20 }} sx={{ mt: 2 ,p:4}}>
                <Grid item xs={5} >
                    <Typography variant="subtitle2" fontWeight={600} color="#344054">
                        Documents
                    </Typography>
                    <Typography variant="body2" color="#667085" sx={{ lineHeight: "24px" }}>
                    Use your documents that contain information relevant to your business.
                     EchoWin will automatically read your documents to add new information to your agent's knowledge base.
                    </Typography>
                </Grid>
                    <Grid item xs={7}>
                        <Box sx={{ width: '100%' }}>
                            <Paper
                                {...getRootProps()}
                                sx={{
                                    textAlign: 'center',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    p: 4,
                                    mb: 3,
                                    transition: 'border-color 0.3s',
                                    '&:hover': { borderColor: '#40C4FF' },
                                    boxShadow: 3,
                                }}
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <Typography>Drop the files here...</Typography>
                                ) : (
                                    <Box>
                                        <img src={UplaodIcon}/>
                                        <Typography variant="body1" color="textSecondary">
                                            <span style={{ color: "#40C4FF", fontWeight: "500" }}>Click to upload</span> or drag and drop
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            SVG, PDF, JPG, or GIF (max. 800×400px)
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            {files.map((file, index) => (
                                <Paper
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 2,
                                        p: 2,
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '8px',
                                        boxShadow: 1,
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: '500' }}>{file.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {file.size}
                                        </Typography>
                                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress}
                                                sx={{
                                                    flexGrow: 1,
                                                    height: 6,
                                                    borderRadius: 5,
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: '#40C4FF',
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ ml: '8px', color: '#40C4FF' }}>
                                                {uploadProgress}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => handleDelete(index)} color="error">
                                    <img src={DellIcon}/>

                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>
                    </Grid>
            </Grid>

        </>

    );
};

export default FileUpload;
