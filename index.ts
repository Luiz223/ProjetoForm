import React from 'react';
import { createRoot } from 'react-dom/client'; // Atualizado para usar createRoot
import App from './App'; // Supondo que o componente principal é App

const container = document.getElementById('root')!;
const root = createRoot(container); // Cria a raiz do aplicativo
root.render(<App />); // Renderiza o aplicativo
