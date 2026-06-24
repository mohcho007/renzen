const subdomain = "renzen";
const apiKey = "live_FDBfPQWEl1MWhSp0Keo9";
const baseUrl = `https://${subdomain}.launch27.com/v1/`;

async function testFrequency(freqId) {
  const payload = {
    service_date: "2026-06-14T10:00:00",
    frequency_id: parseInt(freqId, 10),
    services: [
      {
        id: 213,
        pricing_parameters: [
          {
            id: 86,
            quantity: 100,
          },
        ],
        extras: [],
      },
    ],
  };

  const response = await fetch(`${baseUrl}booking/estimate_price`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log(`Frequency ${freqId} Total:`, data.total, `Subtotal:`, data.subtotal, `Discount:`, data.discount);
}

async function run() {
  await testFrequency("1");  // Oneoff
  await testFrequency("22"); // Hver 2. uge (15% in config)
  await testFrequency("17"); // Hver uge (20% in config)
}

run();
