import React from 'react';
import { createRoot } from 'react-dom/client';
import FamousRelativeWidget from './App.jsx';

const container = document.getElementById('famous-relative-widget');
if (container) {
  const root = createRoot(container);
  root.render(<FamousRelativeWidget />);
}
