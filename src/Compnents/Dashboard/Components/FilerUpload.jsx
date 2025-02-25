import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, LinearProgress, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '../../Assets/UploadIcon2.png';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig'; 

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles
            .filter((file) => validateFile(file))
            .map((file) => ({
                file,
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
            }));

        if (newFiles.length === 0) return; 

        setFiles(newFiles);  

        newFiles.forEach((fileObj) => {
            uploadToFirebase(fileObj.file); 
        });
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/svg+xml', 'application/pdf', 'image/jpeg', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; 
        const maxWidth = 800;
        const maxHeight = 400;

        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only SVG, PDF, JPG, and GIF are allowed.');
            return false;
        }

        if (file.size > maxSize) {
            toast.error('File size exceeds the 5MB limit.');
            return false;
        }

        if (file.type.startsWith('image')) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            // img.onload = () => {
            //     if (img.width > maxWidth || img.height > maxHeight) {
            //         toast.error('Image dimensions exceed the 800x400px limit.');
            //     }
            // };
        }

        return true;
    };

    const uploadToFirebase = (file) => {
        const fileName = `${Date.now()}-${file.name}`; 
        const storageRef = ref(storage, `uploads/${fileName}`);  
        const uploadTask = uploadBytesResumable(storageRef, file); 

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prev) => ({ ...prev, [file.name]: progress.toFixed(0) }));
            },
            (error) => {
                console.error('Error uploading file:', error);
                toast.error('Failed to upload file!');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); 
                toast.success('File uploaded successfully!');
            }
        );
    };

    const handleDelete = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        setUploadProgress((prev) => {
            const updatedProgress = { ...prev };
            delete updatedProgress[files[index].name];  
            return updatedProgress;
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 5, sm: 5, md: 20 }} sx={{ mt: 2, p: 4 }}>
                <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" fontWeight={600} color="#344054">
                        Documents
                    </Typography>
                    <Typography variant="body2" color="#667085" sx={{ lineHeight: '24px' }}>
                        Upload documents relevant to your business. EchoWin will automatically read them to add new information to your agent's knowledge base.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
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
                                    <img src={UploadIcon} alt="Upload Icon" />
                                    <Typography variant="body1" color="textSecondary">
                                        <span style={{ color: '#40C4FF', fontWeight: '500' }}>Click to upload</span> or drag and drop
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        SVG, PDF, JPG or GIF (max. 800×400px)
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
                                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                                        {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {file.size}
                                    </Typography>
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress[file.name] || 0}
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
                                            {uploadProgress[file.name] || 0}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer />
        </>
    );
};

export default FileUpload;
