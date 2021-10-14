let isDev = false;

if (process.env.NODE_ENV === 'development') isDev = true;

module.exports = isDev;
