import React from 'react';
import FileUpload from './components/FileUpload';
import View from './components/View';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App
