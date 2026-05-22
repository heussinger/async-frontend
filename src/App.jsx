import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./dashboard.jsx";
import Login from "./login.jsx";

export default function App() {
  return (
    <BrowserRouter >
        <div class="app">
            <Routes>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/login"        element={<Login />} />
                <Route path="/"             element={<Navigate to="/login" replace/>} />
            </Routes>
        </div>
    </BrowserRouter>
  )
}