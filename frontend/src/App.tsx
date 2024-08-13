import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
// import RequireAuth from "./features/auth/components/RequireAuth/RequireAuth";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="" element={<Pages.Home />} />
            <Route path="/login" element={<Pages.Login />} />
            <Route path="/register" element={<Pages.Register />} />
            <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
            <Route path="/password-reset/:token" element={<Pages.ResetPassword />} />
        </Routes>
    );
}

export default App;
