import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import RouterX from './router';

function App() {
	console.log('app.js working')
	return (
		<BrowserRouter>
			<RouterX />
		</BrowserRouter>
	);
}

export default App;
