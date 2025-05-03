import React, { useState } from 'react';
import axios from 'axios';
import './pdfUploader.css';

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const { data } = await axios.post('http://localhost:8855/upload', formData);
      setCsvUrl(data.csvUrl);
      alert('Upload successful!');
    } catch (err) {
      alert('Upload failed.');
    }
  };

  return (
    <div className="pdf-uploader">
      <h2 className="uploader-title">Upload Your Course Outline</h2>

      <input
        type="file"
        accept="application/pdf"
        className="file-input"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="upload-button" onClick={handleUpload}>Upload</button>

      {csvUrl && (
        <a className="download-button" href={csvUrl} download>
          Download CSV
        </a>
      )}
    </div>
  );
};

export default PdfUploader;
