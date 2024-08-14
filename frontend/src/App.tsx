import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
// import RequireAuth from "./features/auth/components/RequireAuth/RequireAuth";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="" element={<Pages.Home />} />
            <Route path="/login" element={<Pages.Auth.Login />} />
            <Route path="/register" element={<Pages.Auth.Register />} />
            <Route path="/forgot-password" element={<Pages.Auth.ForgotPassword />} />
            <Route path="/password-reset/:token" element={<Pages.Auth.ResetPassword />} />
            <Route path="/verify-email" element={<Pages.Auth.VerifyEmail />} />
        </Routes>
    );
}

export default App;
