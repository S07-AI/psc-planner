import React from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import PdfUploader from './components/sorryShayan';

function App() {
  return (
    <div className="App">
      <Header />
      <PdfUploader />
      <Footer />
    </div>
  );
}

export default App;
