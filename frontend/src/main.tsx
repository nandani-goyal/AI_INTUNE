import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);


