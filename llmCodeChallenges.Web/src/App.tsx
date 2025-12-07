import { BrowserRouter, Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Problem from "./pages/Problem";
import Publish from "./pages/Publish";
import Preview from "./pages/Preview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Problems />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/challenge/:id" element={<Problem />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/publish/preview" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
