import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./index.css";

export default function DefaultLayout() {
    return (
        <>
            <Navbar></Navbar>
            <Outlet />
        </>
    );
}
