import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Builder     from './pages/Builder';
import PreviewPage from './pages/PreviewPage';

// To be built in Day 3
// import Home          from './pages/Home';
// import TemplatesPage from './pages/TemplatesPage';

function Placeholder({ name }) {
  return (
    <div className="flex items-center justify-center h-screen text-2xl font-semibold text-slate-500">
      {name} — coming soon
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Routes>
          <Route path="/"          element={<Placeholder name="Home" />} />
          <Route path="/builder"   element={<Builder />} />
          <Route path="/templates" element={<Placeholder name="Templates" />} />
          <Route path="/preview"   element={<PreviewPage />} />
        </Routes>
      </ResumeProvider>
    </BrowserRouter>
  );
}
