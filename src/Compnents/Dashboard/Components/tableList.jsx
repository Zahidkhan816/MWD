import React, { useState } from 'react';
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
  Button
} from '@mui/material';
const TableList = ({ setSelected }) => {
  const handleTab = () => {
    setSelected('Reports')
  }
  const documentData = [
    {
      name: "Assistance's Knowledge Base",
      fileName: "knowledge_base_1.pdf",
      fileSize: "1.2 MB",
      date: "2024-11-11",
      time: "10:30 AM"
    },
    {
      name: "Sample Knowledge Base",
      fileName: "sample_base.pdf",
      fileSize: "1.8 MB",
      date: "2024-11-10",
      time: "2:15 PM"
    },
    {
      name: "Product Documentation",
      fileName: "product_doc.pdf",
      fileSize: "3.4 MB",
      date: "2024-11-09",
      time: "11:45 AM"
    },
    {
      name: "User Guide",
      fileName: "user_guide_v2.pdf",
      fileSize: "2.3 MB",
      date: "2024-11-08",
      time: "9:00 AM"
    },
    {
      name: "Project Report",
      fileName: "project_report_2024.pdf",
      fileSize: "4.7 MB",
      date: "2024-11-07",
      time: "1:20 PM"
    },
    {
      name: "Meeting Notes",
      fileName: "meeting_notes.pdf",
      fileSize: "0.9 MB",
      date: "2024-11-06",
      time: "3:30 PM"
    },
    {
      name: "Financial Summary",
      fileName: "financial_summary.pdf",
      fileSize: "1.1 MB",
      date: "2024-11-05",
      time: "4:45 PM"
    },
    {
      name: "Marketing Strategy",
      fileName: "marketing_strategy.pdf",
      fileSize: "2.5 MB",
      date: "2024-11-04",
      time: "10:00 AM"
    },
    {
      name: "Technical Specification",
      fileName: "tech_spec.pdf",
      fileSize: "3.2 MB",
      date: "2024-11-03",
      time: "12:10 PM"
    },
    {
      name: "Employee Handbook",
      fileName: "employee_handbook.pdf",
      fileSize: "5.0 MB",
      date: "2024-11-02",
      time: "8:45 AM"
    },
    {
      name: "Training Manual",
      fileName: "training_manual.pdf",
      fileSize: "4.1 MB",
      date: "2024-11-01",
      time: "2:50 PM"
    },
    {
      name: "Development Roadmap",
      fileName: "dev_roadmap.pdf",
      fileSize: "3.7 MB",
      date: "2024-10-31",
      time: "11:15 AM"
    }
  ];


  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ p:1 }}>
      <Grid item xs={10}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ color: "#344054", fontWeight: 500, textAlign: "center", marginBottom: 2 }}
            >
              Documents List
            </Typography >
            <div style={{ overflowX: "auto"}}>
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
                {documentData.map((doc, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{doc.name}</TableCell>
                    <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>{doc.fileName}</TableCell>
                    <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>{doc.fileSize}</TableCell>
                    <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>{doc.date}</TableCell>
                    <TableCell align="center" sx={{ color: "#344054", fontWeight: 500 }}>{doc.time}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" sx={{ borderRadius: 2, backgroundColor: "#1976d2", color: "#FFF" }} onClick={handleTab}>
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
