const allowedCors = [
  'https://tma.nomoredomains.work',
  'http://tma.nomoredomains.work',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { headers, method } = req;

  if (allowedCors.includes(headers.origin)) {
    res.header('Access-Control-Allow-Origin', headers.origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header(
      'Access-Control-Allow-Headers',
      headers['access-control-request-headers'],
    );
    res.header('Access-Control-Allow-Credentials', true);
    return res.end();
  }

  return next();
};

module.exports = cors;
