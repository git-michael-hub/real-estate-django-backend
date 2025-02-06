import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./features/auth/context/AuthProvider.tsx";
import { ListingProvider } from "./features/listings/context/ListingsProvider.tsx";
import { BuyersProvider } from "./features/buyers/context/BuyersProvider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ListingProvider>
                    <BuyersProvider>
                        <App />
                    </BuyersProvider>
                </ListingProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
