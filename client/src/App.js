import React from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import PdfUploader from './components/pdfUploader';
import Uploadthing from './components/uploadThing';
import ChatBot from './components/chatBot';

function App() {
  return (
    <div>
      <Header />
      <PdfUploader />
      <Uploadthing />
      <Footer />
      <ChatBot /> 
    </div>
  );
}
export default App;
