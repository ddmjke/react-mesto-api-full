const allowedCors = [
  'https://moredomains.nomoredomains.sbs/',
  'http://moredomains.nomoredomains.sbs/',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  console.log('origin===>', origin);
  console.log('method===>', method);
  console.log('req.headers===>', requestHeaders);

  if (allowedCors.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.setHeader('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }

  next();
};
