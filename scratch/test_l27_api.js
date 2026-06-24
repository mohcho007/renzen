const https = require('https');

const subdomain = 'renzen';
const apiKey = 'live_FDBfPQWEl1MWhSp0Keo9';
const options = {
  hostname: `${subdomain}.launch27.com`,
  path: '/v1/booking/services',
  method: 'GET',
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
      const services = JSON.parse(data);
      const service213 = services.find(s => s.id === 213);
      if (service213) {
        console.log('Service 213 Details:');
        console.log(JSON.stringify(service213, null, 2));
      } else {
        console.log('Service 213 not found.');
      }
    } catch (e) {
      console.error('Parse Error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.end();
