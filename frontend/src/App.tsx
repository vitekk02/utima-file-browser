import React from "react";
import "./App.css";
import FileBrowser from "./components/FileBrowser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={<FileBrowser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
