import { Routes, Route, useLocation } from "react-router-dom";
import Pages from "./pages";
// import RequireAuth from "./features/auth/components/RequireAuth/RequireAuth";
import DefaultLayout from "./layouts/DefaultLayout";
import "./App.css";

function App() {
    const location = useLocation();

    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="" element={<Pages.Home />} />
                <Route path="/about" element={<Pages.About />} />
                <Route path="/login" element={<Pages.Auth.Login />} />
                <Route path="/register" element={<Pages.Auth.Register />} />
                <Route path="/email-verification/:email" element={<Pages.Auth.EmailVerification />} />
                <Route path="/forgot-password" element={<Pages.Auth.ForgotPassword />} />
                <Route path="/reset-password/:token" element={<Pages.Auth.ResetPassword />} />
                {/* <Route path="/unauthorized" element={<Pages.Auth.Unauthorized />} /> */}
                <Route path="/listings" element={<Pages.Listings.List key={location.search} />} />
                <Route path="/listings/:listingId" element={<Pages.Listings.Details />} />
                <Route path="/user/:username" element={<Pages.Buyers.Profile />} />
                {/* <Route path="/listings/manage" element={<Pages.Listings.Manage />} /> */}
                {/* <Route element={<RequireAuth roles={["seller"]} />}> */}
                {/* <Route path="/listings/new" element={<Pages.Listings.New />} /> */}
                {/* </Route> */}
                {/* <Route path="/sellers" element={<Pages.Sellers.List />} /> */}
                <Route path="/sellers/:username" element={<Pages.Sellers.Profile />} />
                <Route path="/agents/" element={<Pages.Agents.List />} />
                <Route path="/agents/:username" element={<Pages.Agents.Profile />} />
                <Route element={<Pages.MyRealEstate.Layout />}>
                    <Route path="/my-real-estate/accounts" element={<Pages.MyRealEstate.Accounts />} />
                    <Route path="/my-real-estate/dashboard" element={<Pages.MyRealEstate.Dashboard />} />
                    <Route path="/my-real-estate/properties" element={<Pages.MyRealEstate.Properties />} />
                    <Route path="/my-real-estate/properties/new" element={<Pages.MyRealEstate.NewProperties />} />
                    <Route path="/my-real-estate/properties/:propertyId" element={<Pages.MyRealEstate.Property />} />
                    <Route
                        path="/my-real-estate/properties/:propertyId/edit"
                        element={<Pages.MyRealEstate.EditProperties />}
                    />
                    <Route path="/my-real-estate/listings" element={<Pages.MyRealEstate.Listings />} />
                    <Route path="/my-real-estate/listings/new" element={<Pages.MyRealEstate.NewListings />} />
                    <Route
                        path="/my-real-estate/listings/:listingId/edit"
                        element={<Pages.MyRealEstate.EditListings />}
                    />
                    <Route path="/my-real-estate/agents" element={<Pages.MyRealEstate.Agents />} />
                </Route>

                <Route path="*" element={<Pages.NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
