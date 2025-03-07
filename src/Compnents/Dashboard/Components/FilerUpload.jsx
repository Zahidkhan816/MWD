import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "../../Assets/UploadIcon2.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import SendIcon from "@mui/icons-material/Send";
const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [csvData, setCsvData] = useState({ existingData: null, newData: null });
  const [uploadProgress, setUploadProgress] = useState({});
  const [response, setResponse] = useState(null);
  const [filename, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error("Please upload at least one CSV file.");
      return;
    }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...acceptedFiles];

      updatedFiles.forEach((file, index) => {
        const dataType = index === 0 ? "existingData" : "newData";
        handleFileUpload(file, dataType);
      });

      return updatedFiles;
    });

    const fileNameWithoutExtension =
      acceptedFiles[0].name.split(".").slice(0, -1).join(".") ||
      acceptedFiles[0].name;
    setFileName(fileNameWithoutExtension);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".csv",
    onDrop,
  });

  const handleFileUpload = (file, dataType) => {
    if (!file || !file.name.endsWith(".csv")) {
      toast.error("Only CSV files are accepted.");
      return;
    }

    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
      }
    };
    reader.onloadend = () => {
      try {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setCsvData((prevData) => ({
              ...prevData,
              [dataType]: result.data,
            }));
            // if (!toastShown[dataType]) {
            //   toast.success(`CSV file parsed successfully!`);
            //   setToastShown((prev) => ({ ...prev, [dataType]: true }));
            // }
          },
          error: (err) => {
            toast.error(
              `Error parsing ${
                dataType === "existingData" ? "existing" : "new"
              } CSV file: ${err.message}`
            );
          },
        });
      } catch (error) {
        toast.error("File reading error: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  // useEffect(() => {
  //   if (csvData.existingData || csvData.newData) {
  //     invokeLambda();
  //   }
  // }, [csvData]);

  const invokeLambda = async () => {
    if (files.length > 2) {
      toast.error("Max two files can be uploaded");
      return;
    }

    if (!csvData.existingData && !csvData.newData) return;

    setLoading(true);
    try {
      const credentials = {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID_F,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_F,
      };

      if (!credentials.accessKeyId || !credentials.secretAccessKey) {
        throw new Error(
          "AWS credentials are missing. Check your environment variables."
        );
      }

      const lambdaClient = new LambdaClient({
        region: process.env.REACT_APP_REGION_NAME,
        credentials,
      });

      const payload = {
        existing_data: csvData.existingData || [],
        new_data: csvData.newData || [],
        filename: filename,
      };

      console.log(payload, "Payload being sent to Lambda");

      const command = new InvokeCommand({
        FunctionName: process.env.REACT_APP_FUNCTION_NAME,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(payload),
      });

      const lambdaResponse = await lambdaClient.send(command);

      if (!lambdaResponse.Payload) {
        throw new Error("No payload received from Lambda.");
      }

      const decodedPayload = new TextDecoder().decode(lambdaResponse.Payload);
      const parsedResponse = JSON.parse(decodedPayload);
      const responseBody = JSON.parse(parsedResponse.body);
      setResponse(responseBody);

      toast.success("Data processed successfully!");
    } catch (error) {
      console.error("Lambda Invocation Error:", error);
      toast.error(error.message || "Failed to process request.");
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setCsvData({ existingData: null, newData: null });
      setResponse(null);
    }
  };

  return (
    <>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 5, sm: 5, md: 20 }}
        sx={{ mt: 2, p: 4 }}
      >
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" fontWeight={600} color="#344054">
            Documents
          </Typography>
          <Typography variant="body2" color="#667085">
            Upload two CSV files to compare them and identify any duplicated
            data present in both documents.
          </Typography>

          <Box sx={{ width: "100%", padding: "20px" }}>
            <Paper
              {...getRootProps()}
              sx={{
                textAlign: "center",
                border: "2px solid #E0E0E0",
                borderRadius: "12px",
                cursor: "pointer",
                p: 4,
                mb: 3,
                "&:hover": { borderColor: "#40C4FF" },
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography>Drop the files here...</Typography>
              ) : (
                <Box>
                  <img src={UploadIcon} alt="Upload Icon" />
                  <Typography variant="body1" color="textSecondary">
                    <span style={{ color: "#40C4FF", fontWeight: "500" }}>
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    CSV files only (Upload exactly two files)
                  </Typography>
                  {files?.length > 0 &&
                    uploadProgress[files[0].name] !== undefined && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress[files[0].name]}
                        sx={{ mt: 1 }}
                      />
                    )}
                </Box>
              )}
            </Paper>

            {files?.map((file, index) => (
              <Paper
                key={index}
                sx={{ display: "flex", alignItems: "center", mt: 2, p: 2 }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {file.size} bytes
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}

            {/* Align Button to Right */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={invokeLambda}
                endIcon={<SendIcon />}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Message</TableCell>
                  <TableCell align="center">Duplicate Size</TableCell>
                  <TableCell align="center">Duplicate File URL</TableCell>
                  <TableCell align="center">Clean File URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : response ? (
                  <TableRow hover>
                    <TableCell>{"File"}</TableCell>
                    <TableCell align="center">
                      {response?.message || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {response?.duplicate_count || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {response.duplicate_file_url ? (
                        <a
                          href={response.duplicate_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "green",
                            textDecoration: "underline",
                          }}
                        >
                          Download
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {response.clean_file_url ? (
                        <a
                          href={response.clean_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "green",
                            textDecoration: "underline",
                          }}
                        >
                          Download
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default FileUpload;
