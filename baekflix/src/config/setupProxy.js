let {createProxyMiddleware} = require('http-proxy-middleware');
const configData = require('./ConfigLoader');

module.exports = function initializeProxy(app) {
    console.log('Setting up proxy...');
    let serverConfig = configData.getServerInfo();
    console.log("Proxy is setting to connect host: " + serverConfig.host + ", and port: " + serverConfig.port);
    app.use(
        '/user',
        createProxyMiddleware({
            target: `http://${serverConfig.host}:${serverConfig.port}`,
            changeOrigin: true
        })
    );

    app.use(
        '/movie',
        createProxyMiddleware({
            target: `http://${serverConfig.host}:${serverConfig.port}`,
            changeOrigin: true
        })
    );

    app.use(
        '/security',
        createProxyMiddleware({
            target: `http://${serverConfig.host}:${serverConfig.port}`,
            changeOrigin: true
        })
    );
};
