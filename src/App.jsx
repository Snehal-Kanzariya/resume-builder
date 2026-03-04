import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Home          from './pages/Home';
import Builder       from './pages/Builder';
import TemplatesPage from './pages/TemplatesPage';
import PreviewPage   from './pages/PreviewPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter basename="/resume-builder">
          <ResumeProvider>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/builder"   element={<Builder />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/preview"   element={<PreviewPage />} />
            </Routes>
          </ResumeProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
