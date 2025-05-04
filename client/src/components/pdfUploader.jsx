import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pdfUploader.css';
import Papa from 'papaparse';

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);

  useEffect(() => {
    const tokens = new URLSearchParams(window.location.search).get('tokens');
    if (tokens) {
      setAuthTokens(JSON.parse(decodeURIComponent(tokens)));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { data } = await axios.get('http://localhost:8855/auth/google');
      window.location.href = data.url;
    } catch (err) {
      alert('Failed to initialize Google Sign-in');
    }
  };

  const createCalendarEvents = async () => {
    if (!csvData || !authTokens) return;

    console.log('Processing CSV Data:', csvData);
      
    const validEvents = csvData
      .filter(row => Object.keys(row).length > 0)
      .map(row => {
        console.log('Processing row:', row);
        
        // Find title and course code more flexibly
        const titleField = Object.keys(row).find(k => 
          row[k] && typeof row[k] === 'string' && 
          !row[k].toLowerCase().includes('true') && 
          !row[k].toLowerCase().includes('false')
        );
        
        const dateField = Object.keys(row).find(k => 
          k.toLowerCase().includes('date') || 
          k.toLowerCase().includes('deadline') ||
          k.toLowerCase().includes('due')
        );

        if (!titleField || !dateField) {
          console.log('Missing fields:', { titleField, dateField });
          return null;
        }

        const startDate = new Date(row[dateField]);
        if (isNaN(startDate.getTime())) {
          console.log('Invalid date:', row[dateField]);
          return null;
        }

        // Create event object
        return {
          summary: row[titleField],
          description: Object.entries(row)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n'),
          start: {
            dateTime: startDate.toISOString(),
            timeZone: 'America/Toronto'
          },
          end: {
            dateTime: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Toronto'
          }
        };
      })
      .filter(event => event !== null);

    // ...rest of the function remains the same...
    try {
      console.log('Sending events to calendar:', validEvents);

      const response = await axios.post(
        'http://localhost:8855/calendar/create',
        { 
          events: validEvents,
          auth: authTokens 
        },
        { 
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Calendar API Response:', response.data);
      alert(`Successfully created ${validEvents.length} calendar events!`);
    } catch (err) {
      console.error('Failed to create calendar events:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const processCsv = async (url) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      console.log('Raw CSV text:', text);

      // Don't transform headers to lowercase to preserve original names
      const result = Papa.parse(text, { 
        header: true,
        skipEmptyLines: true
      });

      console.log('Parsed CSV:', result);
      setCsvData(result.data);
    } catch (err) {
      console.error('CSV processing error:', err);
      alert('Failed to process CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const { data } = await axios.post('http://localhost:8855/upload', formData);
      setCsvUrl(`http://localhost:8855${data.csvUrl}`);
      alert('Upload successful!');
      processCsv(`http://localhost:8855${data.csvUrl}`);
    } catch (err) {
      alert('Upload failed.');
    }
  };

  return (
    <div className="pdf-uploader">
      <h2 className="uploader-title">Course Outline Calendar Creator</h2>
      
      {!authTokens ? (
        <div className="auth-section">
          <p>Please sign in to continue</p>
          <button className="google-signin" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="upload-section">
          <input
            type="file"
            accept="application/pdf"
            className="file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="upload-button" onClick={handleUpload}>Upload</button>

          {csvUrl && (
            <div className="actions">
              <a className="download-button" href={csvUrl} download>
                Download CSV
              </a>
              <button className="calendar-button" onClick={createCalendarEvents}>
                Add Events to Calendar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
