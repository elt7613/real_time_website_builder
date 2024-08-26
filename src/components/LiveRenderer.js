import React, { useState, useCallback } from 'react';
import UserInput from './UserInput';
import ModifyWebsiteInput from './ModifyWebsiteInput';
import StreamingLivePreview from './StreamingLivePreview';
import { generateWebsite, modifyWebsite } from '../services/openaiService';
import '../styles/LiveRenderer.css';

const LiveRenderer = () => {
  const [userInput, setUserInput] = useState('');
  const [modifyInput, setModifyInput] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateWebsite = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please enter a website description');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHtmlCode(''); // Clear previous code
    setCssCode('');

    try {
      const data = await generateWebsite(userInput);
      console.log('Received data (generate):', data); 
      setHtmlCode(data.html);
      setCssCode(data.css);
    } catch (err) {
      setError('Failed to generate website: ' + err.message);
      console.error('Error generating website:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleModifyWebsite = useCallback(async () => {
    if (!modifyInput.trim()) {
      setError('Please enter a modification description');
      return;
    }
    if (!htmlCode || !cssCode) {
      setError('Please generate a website first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending to modifyWebsite:", modifyInput, htmlCode, cssCode); 

      const data = await modifyWebsite(modifyInput, htmlCode, cssCode);
      console.log('Received data (modify):', data); 
      setHtmlCode(data.html);
      setCssCode(data.css);
    } catch (err) {
      setError('Failed to modify website: ' + err.message);
      console.error('Error modifying website:', err);
    } finally {
      setIsLoading(false);
    }
  }, [modifyInput, htmlCode, cssCode]);


  // Function to download the HTML code
  const handleDownloadHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>My Website</title>
          <style>
             ${cssCode}
          </style>
      </head>
      <body>
          ${htmlCode}
      </body>
      </html>

    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-website.html';
    a.click();

    // Clean up: revoke the object URL after the download
    URL.revokeObjectURL(url);
  };

  return (
    <div className="live-renderer">
      <div className="input-container">
        <h2>WEBSITE DESCRIPTION</h2>
        <div className="user-input-wrapper">
          <UserInput
            value={userInput}
            onChange={setUserInput}
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateWebsite}
            disabled={isLoading}
            aria-label="Generate Website"
          >
            {isLoading ? 'Generating...' : 'Generate Website'}
          </button>
        </div>

        <h2>MODIFY WEBSITE</h2>
        <div className="modify-input-wrapper">
          <ModifyWebsiteInput
            value={modifyInput}
            onChange={setModifyInput}
            disabled={isLoading}
          />
          <button
            onClick={handleModifyWebsite}
            disabled={isLoading || !htmlCode}
            aria-label="Modify Website"
          >
            {isLoading ? 'Modifying...' : 'Modify Website'}
          </button>

          {/* Add the download button */}
          <button 
            onClick={handleDownloadHTML} 
            disabled={!htmlCode} // Disable if no HTML to download
            aria-label="Download HTML"
          >
            Download Code
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
	            <path fill="black" d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z" />
	            <path fill="black" d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06z" />
            </svg>
          </button>

        </div>

        {error && <p className="error" role="alert">{error}</p>}
      </div>
      <div className="preview-container">
        <h2>LIVE PREVIEW</h2>
        <StreamingLivePreview
          htmlCode={htmlCode}
          cssCode={cssCode}
          key={htmlCode + cssCode} 
        />
      </div>
    </div>
  );
};

export default LiveRenderer;