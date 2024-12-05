import React, { useState, useEffect } from 'react';
import { storage, ref, listAll, getDownloadURL, db } from './firebaseConfig';
import { getMetadata } from "firebase/storage";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TableList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  
  
    fetchDocuments();
  }, []);
  
  const fetchDocuments = async () => {
    try {
      const storageRef = ref(storage, 'uploads/');
      const res = await listAll(storageRef);

      const documentData = await Promise.all(
        res.items.map(async (itemRef) => {
          try {
            const metadata = await getMetadata(itemRef);
            const fileUrl = await getDownloadURL(itemRef);
            const createdDate = new Date(metadata.timeCreated);
            const formattedDate = createdDate.toLocaleDateString();
            const formattedTime = createdDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return {
              name: itemRef.name.split('.')[0],
              fileName: itemRef.name,
              fileSize: formatFileSize(metadata.size),
              date: formattedDate,
              time: formattedTime,
              timestamp: createdDate.getTime(), 
              url: fileUrl,
            };
          } catch (error) {
            console.error('Error fetching metadata:', error);
            return null;
          }
        })
      );

      const sortedDocuments = documentData
        .filter((doc) => doc !== null)
        .sort((a, b) => b.timestamp - a.timestamp);

      setDocuments(sortedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes / 1024;
    while (size > 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  };
  const fetchReportData = (docId) => {
    navigate(`/report/${docId}`);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ p: 1 }}>
      <Grid item xs={10}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ color: "#344054", fontWeight: 500, textAlign: "center", marginBottom: 2 }}
            >
              Documents List
            </Typography>
            <div style={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 700, overflowX: "auto" }} aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#667085", fontWeight: 600 }}>Name</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>File Name</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>File Size</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Date</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Time</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : documents.length > 0 ? (
                    documents.map((doc, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.fileName}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.fileSize}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.date}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.time}
                        </TableCell>
                        <TableCell align="center">
                          <button
                            style={{
                              borderRadius: "8px",
                              backgroundColor: "#1976d2",
                              color: "#FFF",
                              padding: "8px 16px",
                              fontWeight: "bold",
                              fontSize: "14px",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                              transition: "background-color 0.3s ease, transform 0.2s ease",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#115293")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
                            onClick={() => fetchReportData(doc.name)}
                          >
                            View Report
                          </button>
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No documents available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TableList;
