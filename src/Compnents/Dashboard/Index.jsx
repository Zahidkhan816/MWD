
import React, { useState } from 'react';


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
