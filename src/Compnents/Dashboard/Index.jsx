
import React, { useState } from 'react';


import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
const Index = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>

  );
};

export default Index;
