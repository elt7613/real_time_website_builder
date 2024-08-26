import React, { useEffect, useRef } from 'react';

const StreamingLivePreview = ({ htmlCode, cssCode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument;

      // Combine HTML and CSS with DOCTYPE
      const completeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style id="dynamic-style">${cssCode || ''}</style>
        </head>
        <body>
          ${htmlCode || '<h1 style="color: #ffffff; text-align: center; font-family: Arial, sans-serif;">Your website will appear here</h1>'}
        </body>
        </html>
      `;

      // Update the entire iframe content
      doc.open();
      doc.write(completeHtml);
      doc.close(); 
    }
  }, [htmlCode, cssCode]);

  return (
    <div className="streaming-live-preview" style={{ height: '100%' }}>
      <iframe 
        ref={iframeRef} 
        title="Streaming Live Preview"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#2c2c2c',
          border: '1px solid #333333',
          borderRadius: '10px',
        }}
      />
    </div>
  );
};

export default StreamingLivePreview;