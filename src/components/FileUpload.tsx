import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const ipdev = import.meta.env.VITE_API_URL_DEV;
  console.log(ipdev)
  const ipprod = import.meta.env.VITE_API_URL_PROD;
  console.log(ipprod)

  // MUDE PARA ipprod QUANDO FOR PARA A PRODUÇÃO
  const ip = ipprod;

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

      try {
        const response = await axios.post(`${ip}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(`File uploaded successfully: ${JSON.stringify(response.data)}`);
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

  return (
    <div className='divUpload'>
      <h2>Upload Excel File</h2>
      <Input type='file' onChange={onFileChange} />
      <Button variant='contained' onClick={onFileUpload} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload'}
      </Button>
      {loading && <p>Extraindo...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
