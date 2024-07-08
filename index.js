const express = require('express');
const jsforce = require('jsforce');
const app = express();

// Endpoint to handle Salesforce Canvas signedRequest
app.post('/canvas', (req, res) => {
  const signedRequest = req.body.signed_request;

  if (!signedRequest) {
    return res.status(400).json({ error: 'Signed Request not found' });
  }

  // Decode the signedRequest using jsforce
  const decodedRequest = jsforce.canvas.decodeSignedRequest(signedRequest);

  // Print the decoded signedRequest (for demonstration)
  console.log('Decoded Signed Request:', decodedRequest);

  // Respond with the decoded signedRequest
  res.json({ decodedRequest });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
