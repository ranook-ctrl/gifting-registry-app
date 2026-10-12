import React from 'react';
import ReactDOM from 'react-dom/client';
import { Retune } from 'retune';
import '../src/fonts.css';
import { Root } from './Root';

// `Root` picks the view (mobile phone frame vs desktop web) from the URL and owns
// the page background each one needs — see landing/Root.tsx.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
    <Retune force />
  </React.StrictMode>
);
