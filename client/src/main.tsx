import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TiptapProvider } from './context/tiptap_context.tsx';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/user_context.tsx';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <UserProvider>
            <HelmetProvider>
                <TiptapProvider>
                    <App />
                </TiptapProvider>
            </HelmetProvider>
        </UserProvider>
    </BrowserRouter>,
)
