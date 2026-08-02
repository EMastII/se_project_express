const http = require('http');
const querystring = require('querystring');
function request(method, path, data, cookie) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers.Cookie = cookie;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);
    const req = http.request({ hostname: 'localhost', port: 3001, path, method, headers }, (res) => {
      let chunks = '';
      res.on('data', (chunk) => { chunks += chunk; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(chunks); } catch (e) { parsed = chunks; }
        resolve({ status: res.statusCode, body: parsed, setCookie: res.headers['set-cookie'] ? res.headers['set-cookie'][0] : null });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
(async () => {
  const signupA = await request('POST', '/signup', { name: 'userA', avatar: 'https://example.com/a.png', email: 'userA@example.com', password: 'passA' });
  console.log('signupA', signupA.status, signupA.body);
  const signinA = await request('POST', '/signin', { email: 'userA@example.com', password: 'passA' });
  console.log('signinA', signinA.status, signinA.body, signinA.setCookie);
  const cookieA = signinA.setCookie ? signinA.setCookie.split(';')[0] : null;
  const createA = await request('POST', '/items', { name: 'itemA', weather: 'hot', imageUrl: 'https://example.com/item.png' }, cookieA);
  console.log('createA', createA.status, createA.body);
  const signupB = await request('POST', '/signup', { name: 'userB', avatar: 'https://example.com/b.png', email: 'userB@example.com', password: 'passB' });
  console.log('signupB', signupB.status, signupB.body);
  const signinB = await request('POST', '/signin', { email: 'userB@example.com', password: 'passB' });
  console.log('signinB', signinB.status, signinB.body, signinB.setCookie);
  const cookieB = signinB.setCookie ? signinB.setCookie.split(';')[0] : null;
  const deleteB = await request('DELETE', `/items/${createA.body._id}`, null, cookieB);
  console.log('deleteB', deleteB.status, deleteB.body);
})().catch((err) => { console.error(err); process.exit(1); });
