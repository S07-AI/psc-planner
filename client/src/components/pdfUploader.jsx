import React, { useState } from 'react';
import axios from 'axios';
import './pdfUploader.css'; // Assuming you have some CSS for styling

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Select a PDF first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const { data } = await axios.post('http://localhost:3000/upload', formData);
      setCsvUrl(data.csvUrl);
      alert('Upload successful!');
    } catch (err) {
      alert('Upload failed.');
    }
  };

  return (
    <div className='pdf-uploader'>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
      {csvUrl && <a href={csvUrl} download>Download CSV</a>}
    </div>
  );
};

export default PdfUploader;
