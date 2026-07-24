const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.write(JSON.stringify({ history: [] }));
req.end();
