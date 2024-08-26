const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

export async function generateWebsite(description) {
  try {
    console.log('Sending request to:', `${BACKEND_URL}/api/generate-website`);
    const response = await fetch(`${BACKEND_URL}/api/generate-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Received data:', data);  // Add this line
    return data;
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to generate website: ' + error.message);
  }
}

export async function modifyWebsite(modificationDescription, currentHtml, currentCss) {
  try {
    console.log('Sending request to:', `${BACKEND_URL}/api/modify-website`);
    const response = await fetch(`${BACKEND_URL}/api/modify-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        modification_description: modificationDescription,
        current_html: currentHtml,
        current_css: currentCss,
      }),
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to modify website: ' + error.message);
  }
}