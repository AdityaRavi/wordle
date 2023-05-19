import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { WordleGame } from './components/WordleGame';

const gameConfig = {
  maxNumGuesses: 6
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WordleGame {...gameConfig} />
);
