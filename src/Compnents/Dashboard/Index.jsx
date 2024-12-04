
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

import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
const Index = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>

  );
};

export default Index;
