import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";


export default function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />
} />
        {/* ...other routes if needed */}
      </Routes>
    </BrowserRouter>
  );
}
