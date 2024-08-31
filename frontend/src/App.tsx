import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
import RequireAuth from "./features/auth/components/RequireAuth/RequireAuth";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="" element={<Pages.Home />} />
            <Route path="/login" element={<Pages.Auth.Login />} />
            <Route path="/register" element={<Pages.Auth.Register />} />
            <Route path="/forgot-password" element={<Pages.Auth.ForgotPassword />} />
            <Route path="/password-reset/:token" element={<Pages.Auth.ResetPassword />} />
            <Route path="/unauthorized" element={<Pages.Auth.Unauthorized />} />
            <Route path="/listings" element={<Pages.Listings.List />} />
            <Route path="/listings/:id" element={<Pages.Listings.Details />} />

            <Route element={<RequireAuth is_buyer={true} />}>
                <Route path="/buyer" element={<Pages.Roles.Buyer />} />
            </Route>
            <Route element={<RequireAuth is_seller={true} />}>
                <Route path="/seller" element={<Pages.Roles.Seller />} />
            </Route>
            <Route element={<RequireAuth is_agent={true} />}>
                <Route path="/agent" element={<Pages.Roles.Agent />} />
            </Route>
        </Routes>
    );
}

export default App;
