const https = require('https');

module.exports = function(app) {
  // Create a simple API endpoint that makes the exact same request as curl
  app.get('/api/customers', (req, res) => {
    console.log('🔄 Making direct API call...');
    
    const postData = JSON.stringify({
      query: `query GetDncEntitiesForCache {
        customers(order: { id: ASC }, where: { custentityLongitude: { neq: null } }) {
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          nodes {
            custentityLatitude
            custentityLongitude
            id
            fullname
          }
        }
      }`
    });

    const options = {
      hostname: 'internal.suite-mirror.dev.api.cvoice.io',
      port: 443,
      path: '/graphql/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      console.log('📡 API Response status:', apiRes.statusCode);
      
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ API call successful, returning data');
          res.json(jsonData);
        } catch (error) {
          console.error('❌ JSON parse error:', error.message);
          res.status(500).json({ error: 'Invalid JSON response' });
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('❌ API call failed:', error.message);
      res.status(500).json({ error: error.message });
    });

    apiReq.write(postData);
    apiReq.end();
  });
};
