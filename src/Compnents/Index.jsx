
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Stack,
  Typography,
  Button,
  Box,
  ButtonGroup,
  Paper,
} from '@mui/material';
import FileUpload from './FilerUpload';
import TableList from './tableList';
import Transcripts from './Transcripts';

const Index = () => {
  
  const [selected, setSelected] = useState("Upload Docs");

  const handleSelect = (tab) => {
    setSelected(tab);
    console.log(selected)
  };

  return (
    <div>


      <Box sx={{ width: '100%' }}>
        <Stack
          direction={{ sx: 'column', sm: 'row' }}
          alignItems="center"
          gap={5}
          justifyContent="space-between"
          sx={{ p: 3 }}
        >
          <Typography variant="h5" fontWeight={600} fontSize={20}>
          POC Docs Converter
          </Typography>
        </Stack>

        <Box
          sx={{
            border: '1px solid #D0D5DD',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
          }}
        >
          <ButtonGroup variant="outlined" sx={{ width: '100%' }}>
            {['Upload Docs', 'Documents List', 'Reports'].map((label) => (
              <Button
                key={label}
                onClick={() => handleSelect(label)}
                size="large"
                sx={{
                  color: selected === label ? '#2196F3' : '#344054',
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '20px',
                  border: '1px solid #D0D5DD',
                  backgroundColor: selected === label ? '#F9FAFB' : '#FFFFFF',
                  width: { xs: '100%', sm: 'auto' },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box sx={{ mt: 3 }}>
          {selected === 'Upload Docs' && <FileUpload />}
          {selected === 'Documents List' && <TableList  setSelected={setSelected}/>}
          {selected === 'Reports' && <Transcripts />}
        </Box>
      </Box>
    </div>
  );
};

export default Index;
