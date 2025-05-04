import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pdfUploader.css';
import Papa from 'papaparse';
import googleLogo from './google.png'; // Ensure this path is correct

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [authTokens, setAuthTokens] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Parse auth tokens from URL (OAuth)
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
    } catch {
      alert('Failed to initialize Google Sign-in');
    }
  };

  const createCalendarEvents = async () => {
    if (!csvData || !authTokens) return;

    const validEvents = csvData
      .filter(row => Object.keys(row).length > 0)
      .map(row => {
        const titleField = Object.keys(row).find(k =>
          row[k] &&
          typeof row[k] === 'string' &&
          !row[k].toLowerCase().includes('true') &&
          !row[k].toLowerCase().includes('false')
        );

        const dateField = Object.keys(row).find(k =>
          k.toLowerCase().includes('date') ||
          k.toLowerCase().includes('deadline') ||
          k.toLowerCase().includes('due')
        );

        if (!titleField || !dateField) return null;

        const startDate = new Date(row[dateField]);
        if (isNaN(startDate.getTime())) return null;

        return {
          summary: row[titleField],
          description: Object.entries(row)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n'),
          start: {
            dateTime: startDate.toISOString(),
            timeZone: 'America/Toronto',
          },
          end: {
            dateTime: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Toronto',
          },
        };
      })
      .filter(event => event !== null);

    try {
      await axios.post(
        'http://localhost:8855/calendar/create',
        {
          events: validEvents,
          auth: authTokens,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setSuccessMessage(`Successfully created ${validEvents.length} calendar events!`);
    } catch (err) {
      console.error(err);
      setSuccessMessage(null);
      alert('Error creating calendar events');
    }
  };

  const processCsv = async (url) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });
      setCsvData(result.data);
    } catch {
      alert('Failed to process CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first.');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const { data } = await axios.post('http://localhost:8855/upload', formData);
      const fullCsvUrl = `http://localhost:8855${data.csvUrl}`;
      setCsvUrl(fullCsvUrl);
      setSuccessMessage('Upload successful!');
      processCsv(fullCsvUrl);
    } catch {
      setSuccessMessage(null);
      alert('Upload failed.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a valid PDF file.');
    }
  };

  return (
    <div className="pdf-uploader">
      <h2 className="uploader-title">Course Outline Calendar Creator</h2>
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      {!authTokens ? (
        <div className="auth-section">
          <p>Please sign in to continue</p>
          <button className="google-signin" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="upload-section">
          <div
            className={`custom-dropzone ${isDragging ? 'dragging' : ''}`}
            onClick={() => document.getElementById('file-upload').click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {file ? file.name : 'Click or drag your course outline here'}
          </div>

          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            className="hidden-file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="upload-button" onClick={handleUpload}>Upload</button>

          {csvUrl && (
            <div className="actions">
              <button className="calendar-button" onClick={createCalendarEvents}>
                <img src={googleLogo} alt="Google Logo" className="google-logo" />
                Add Events to Google Calendar
              </button>
              <a className="download-button" href={csvUrl} download>
                Download CSV
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
