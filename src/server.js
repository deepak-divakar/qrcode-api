const express = require('express');
const { SimpleQr } = require('simple-qrbtf');
const app = express();
const svg2img = require('svg2img');
app.use(express.json());

const access_token = process.env.apiKey || apiKey;

function verifyApiKey(req, res, next) {
  const { key } = req.headers;

  if (!key || key !== access_token) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }

  next();
}

app.post('/api/generate', verifyApiKey, (req, res) => {
  try {
    const { qrid } = req.body;
    const options = {
        content: 'https://superrpets.com/qr?qrid=' + qrid,
        icon: { enabled: 5, scale: 18 },
        correctLevel: 'M',
        type : 'round',
        size: 70,
        opacity: 80,
        posType: 'roundRect',
        otherColor: '#21448B',
        posColor: '#21448B',
    };
    const qrData = SimpleQr.base(options);
    const pngOptions = {
        quality: 100,
        resvg: {
          background: 'rgb(255, 255, 255)',
          fitTo: {
            mode: 'width',
            value: 600,
          },
        },
      };
    svg2img(qrData, pngOptions, (error, buffer) => {
        if (error) {
          res.json('Failed to convert SVG to JPEG');
        }
        const pngDataURL = `data:image/png;base64,${buffer.toString('base64')}`;
        res.json({ pngDataURL });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});