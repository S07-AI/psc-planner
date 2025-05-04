import React from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import PdfUploader from './components/pdfUploader';
import Uploadthing from './components/uploadThing';
import ChatBot from './components/chatBot';

function App() {
  const [pdfText, setPdfText] = React.useState(null);
  const [showCalendarButtons, setShowCalendarButtons] = React.useState(false);

  // Add this to debug
  console.log("PDF Text:", pdfText);

  const handlePdfProcessed = (text) => {
    setPdfText(text);
    setShowCalendarButtons(true);
  };

  return (
    <div className="App">
      <Header />
      <PdfUploader setPdfText={handlePdfProcessed} />
      <Uploadthing />
      {pdfText && (
        <div>
          {/* Calendar buttons section */}
          <div className="calendar-buttons">
            {/* Your existing calendar buttons */}
          </div>
          
          {/* ChatBot component */}
          <ChatBot pdfContent={pdfText} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
