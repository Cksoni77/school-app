import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Student from "./components/student/StudentPortal";
//import Teacher from "./components/teacher/TeacherProfile"; // create this file if missing
import ProtectedRoute from "./components/route/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
  path="/home"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Home />
    </ProtectedRoute>
  }
/>

<Route
  path="/student"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <Student />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;