import React from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import PdfUploader from './components/pdfUploader';
import Uploadthing from './components/uploadThing';

function App() {
  return (
    <div className="App">
      <Header />
      <PdfUploader />
      <Uploadthing/>
      <Footer />
    </div>
  );
}

export default App;
