import React, { useState } from 'react';
import axios from 'axios';

const PdfUploader = () => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF file first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(`Success: ${res.data.message}`);
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
};

export default PdfUploader;
