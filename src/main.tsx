import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CareerAnalysisProvider } from './contexts/CareerAnalysisContext'

createRoot(document.getElementById("root")!).render(
  <CareerAnalysisProvider>
    <App />
  </CareerAnalysisProvider>
);
