import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/AppTheme';
import Layout from './components/Layout';
import MonedasPage from './pages/MonedasPage';
import ListasPage from './pages/ListasPage';
import PreciosPage from './pages/PreciosPage';
import ProductosPage from './pages/ProductosPage';

const Dashboard = () => <h1>Dashboard (Work in Progress)</h1>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="monedas" element={<MonedasPage />} />
            <Route path="listas" element={<ListasPage />} />
            <Route path="precios" element={<PreciosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
