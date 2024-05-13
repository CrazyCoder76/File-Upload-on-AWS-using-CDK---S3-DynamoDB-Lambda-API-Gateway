import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [fileContent, setFileContent] = useState('');
    const [file, setFile] = useState(null);

    const handleUpload = async () => {

      if (!file) {
        alert('Please upload a file!');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileContent', fileContent);
      
      try {

        const response = await axios.post('AWS_API_URL', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(response.data);
        
      } catch (error) {
        console.error('Error uploading file: ', error);
      }

    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    return (
        <div>
            <div style={{ marginBottom: "10px"}}>
              <label>Text input: </label>
              <input
                type="text"
                value={fileContent}
                onChange={e => setFileContent(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px"}}>
              <label>File input: </label>
              <input
                type="file"
                value={file}
                onChange={handleFileChange}
              />
            </div>
            <button onClick={handleUpload}>Submit</button>
        </div>
    );
}

export default App;