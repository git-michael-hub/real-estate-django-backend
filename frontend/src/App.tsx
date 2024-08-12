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
        </Routes>
    );
}

export default App;
