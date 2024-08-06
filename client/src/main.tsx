import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TiptapProvider } from './context/tiptap_context.tsx';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/user_context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <TiptapProvider>
                    <App />
                </TiptapProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
