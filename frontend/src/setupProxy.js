const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.vercel.app',
            changeOrigin: true,
        })
    );
};
