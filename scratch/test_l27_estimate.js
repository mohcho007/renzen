const https = require('https');

const subdomain = 'renzen';
const apiKey = 'live_FDBfPQWEl1MWhSp0Keo9';

const apiPayload = {
  service_date: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T10:00:00',
  frequency_id: 1, // One-off
  services: [
    {
      id: 213, // Boligens størrelse
      pricing_parameters: [
        {
          id: 86, // Antal m2
          quantity: 70
        }
      ],
      extras: []
    }
  ]
};

const options = {
  hostname: `${subdomain}.launch27.com`,
  path: '/v1/booking/estimate_price',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log('Estimation Response:');
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.error('Parse Error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(JSON.stringify(apiPayload));
req.end();
