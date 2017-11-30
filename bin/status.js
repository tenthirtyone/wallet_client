const request = require('request');

request.get('http://localhost:8332/', (err, res, body) => {
  if (err) {
    throw new Error(err);
  }

  if (body) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      throw new Error(e);
    }
    console.log(`
      Network: ${body.network}
      Chain:
        Height: ${body.chain.height}
        Tip:    ${body.chain.tip}
        %:      ${body.chain.progress}
      Uptime: ${body.time.uptime/60/60} (hours)`)
  }
})