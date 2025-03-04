import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './Compnents/Dashboard/Index';
import FileUpload from './Compnents/Dashboard/Components/FilerUpload';
import TableList from './Compnents/Dashboard/Components/tableList';
// import Transcripts from './Compnents/Dashboard/Components/Transcripts';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<FileUpload />} /> 
          <Route path="table-list" element={<TableList />} />
          {/* <Route path="/report/:docId" element={<Transcripts />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
