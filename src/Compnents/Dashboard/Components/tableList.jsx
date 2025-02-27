import React, { useState, useEffect } from "react";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TableList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const invokeLambda = async () => {
    setLoading(true)
    try {
      const lambdaClient = new LambdaClient({
        region: process.env.REACT_APP_REGION_NAME,
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID_F,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_F,
        },
      });

      const command = new InvokeCommand({
        FunctionName: "getallcsv",
        InvocationType: "RequestResponse",
        Payload: "",
      });
      const response = await lambdaClient.send(command);
      const responsePayload = new TextDecoder().decode(response.Payload);
      const parsedResponse = JSON.parse(responsePayload);
      setDocuments(parsedResponse?.body)
      setLoading(false)
    } catch (error) {
      console.error("Lambda Invocation Error:", error);
      setLoading(false)
    }
  };



  useEffect(() => {
    invokeLambda();
  }, []);


  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ p: 1 }}>
      <Grid item xs={10}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ color: "#344054", fontWeight: 500, textAlign: "center", marginBottom: 2 }}
            >
              Documents History
            </Typography>
            <div style={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Name</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Duplicates</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Duplicate File</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Clean File</TableCell>
                    <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Timestamp</TableCell>
                    {/* <TableCell align="center" sx={{ color: "#667085", fontWeight: 600 }}>Actions</TableCell> */}
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
                        <TableCell align="center">{doc.filename}</TableCell>
                        <TableCell align="center">{doc.duplicate_count}</TableCell>
                        <TableCell align="center">
                          <a href={doc.duplicate_file_url} style={{color:"green"}} target="_blank" rel="noopener noreferrer">Download</a>
                        </TableCell>
                        <TableCell align="center">
                          <a href={doc.clean_file_url} style={{color:"green"}} target="_blank" rel="noopener noreferrer">Download</a>
                        </TableCell>
                        <TableCell align="center">{doc.timestamp}</TableCell>
                        {/* <TableCell align="center">
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
                          onClick={() => DeleteFIle(doc.uuid)}
                          >
                            Delete
                          </button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No documents available.</TableCell>
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
