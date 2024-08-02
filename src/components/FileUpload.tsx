import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadAvailable, setDownloadAvailable] = useState<boolean>(false);

  const ipdev = import.meta.env.VITE_API_URL_DEV;
  console.log(ipdev)
  const ipprod = import.meta.env.VITE_API_URL_PROD;
  console.log(ipprod)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      setMessage('');
      setDownloadAvailable(false);

      try {
        const response = await axios.post(`${ipdev}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(`File uploaded successfully: ${JSON.stringify(response.data)}`);
        setDownloadAvailable(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setMessage(`Failed to upload file: ${error.response ? error.response.data.error : error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setMessage('Please select a file first');
    }
  };

  const onDownload = async () => {
    try {
      const response = await axios.get(`${ipdev}/export-audiencias`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audiencias.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(`Failed to download file: ${error.response ? error.response.data.error : error.message}`);
    }
  }

  return (
    <div className='divUpload'>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload'}
      </button>
      {loading && <p>Extraindo...</p>}
      {message && <p>{message}</p>}
      {downloadAvailable && (
        <button onClick={onDownload}>
          Baixar Pautas
        </button>
      )}
    </div>
  );
};

export default FileUpload;
