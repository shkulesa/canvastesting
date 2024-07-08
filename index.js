const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const consumerSecretApp =
  process.env.CANVAS_CONSUMER_SECRET || '44B72246CC90337815F2A3712C486191B7F59A821151C09301470C70A1B4459B';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const signedRequest = req.body.signed_request;
  if (!signedRequest) {
    return res.status(400).json({ error: 'Signed Request not found' });
  }

  const [encodedSig, encodedEnvelope] = signedRequest.split('.');
  const hmac = crypto.createHmac('sha256', consumerSecretApp);
  hmac.update(encodedEnvelope);
  const digest = hmac.digest('base64');

  if (digest !== encodedSig) {
    return res.status(400).json({ error: 'Invalid signed request' });
  }

  const jsonEnvelope = Buffer.from(encodedEnvelope, 'base64').toString('utf8');
  const context = JSON.parse(jsonEnvelope);

  console.log('Decoded Signed Request:', context);

  res.json({ context });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
