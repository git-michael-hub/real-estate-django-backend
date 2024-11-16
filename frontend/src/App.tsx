import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
// import RequireAuth from "./features/auth/components/RequireAuth/RequireAuth";
import DefaultLayout from "./layouts/DefaultLayout";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="" element={<Pages.Home />} />
                <Route path="/login" element={<Pages.Auth.Login />} />
                <Route path="/register" element={<Pages.Auth.Register />} />
                <Route path="/forgot-password" element={<Pages.Auth.ForgotPassword />} />
                <Route path="/password-reset/:token" element={<Pages.Auth.ResetPassword />} />
                <Route path="/unauthorized" element={<Pages.Auth.Unauthorized />} />
                <Route path="/listings" element={<Pages.Listings.List />} />
                <Route path="/listings/:id" element={<Pages.Listings.Details />} />
                <Route path="/listings/manage" element={<Pages.Listings.Manage />} />
                {/* <Route element={<RequireAuth roles={["seller"]} />}> */}
                <Route path="/listings/new" element={<Pages.Listings.New />} />
                {/* </Route> */}
                <Route path="/agents" element={<Pages.Sellers.List />} />
                <Route path="/agents/:username" element={<Pages.Sellers.Profile />} />
            </Route>
        </Routes>
    );
}

export default App;
