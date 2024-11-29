import React, { useState, useEffect } from 'react';
import { storage, ref, listAll, getDownloadURL } from './firebaseConfig';
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
  Button, CircularProgress
} from '@mui/material';

const TableList = ({ setSelected }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading as true

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const storageRef = ref(storage, 'uploads/');
        const res = await listAll(storageRef);

        const documentData = await Promise.all(res.items.map(async (itemRef) => {
          try {
            const metadata = await getMetadata(itemRef);
            const fileUrl = await getDownloadURL(itemRef);

            // Format the timestamp (metadata.timeCreated) into date and time
            const createdDate = new Date(metadata.timeCreated);
            const formattedDate = createdDate.toLocaleDateString(); // Format the date

            // Format the time portion
            const formattedTime = createdDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return {
              name: itemRef.name.split('.')[0],
              fileName: itemRef.name,
              fileSize: metadata.size,             // Get file size from metadata
              date: formattedDate,                 // Formatted date
              time: formattedTime,                 // Formatted time
              url: fileUrl,
            };
          } catch (error) {
            console.error('Error fetching metadata:', error);
            return null; // If fetching metadata fails, return null
          }
        }));

        setDocuments(documentData.filter(doc => doc !== null)); // Filter out null results
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or error occurs
      }
    };

    fetchDocuments();
  }, []); // Run only once when component mounts

  const handleTab = () => {
    setSelected('Reports');
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
                  ) : (
                    documents.map((doc, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.fileName}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.fileSize} bytes {/* Display file size */}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {new Date(doc.date).toLocaleDateString()} {/* Format date */}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>
                          {doc.time} {/* Display formatted time */}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2, backgroundColor: "#1976d2", color: "#FFF" }}
                            onClick={() => window.open(doc.url, "_blank")}
                          >
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
