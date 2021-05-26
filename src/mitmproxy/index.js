const tlsUtils = require('../tls/tlsUtils');
const http = require('http');
const config = require('../common/config');
const colors = require('colors');
const createRequestHandler = require('./createRequestHandler');
const createConnectHandler = require('./createConnectHandler');
const createFakeServerCenter = require('./createFakeServerCenter');
const createUpgradeHandler = require('./createUpgradeHandler');


module.exports = {
    createProxy({
        port = config.defaultPort,
        caCertPath,
        caKeyPath,
        sslConnectInterceptor,
        requestInterceptor,
        responseInterceptor,
        getCertSocketTimeout = 1 * 1000,
        middlewares = [],
        externalProxy
    }) {

        // Don't reject unauthorized
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

        if (!caCertPath && !caKeyPath) {
            var rs = this.createCA();
            caCertPath = rs.caCertPath;
            caKeyPath = rs.caKeyPath;
            if (rs.create) {
                console.log(colors.cyan(`CA Cert saved in: ${caCertPath}`));
                console.log(colors.cyan(`CA private key saved in: ${caKeyPath}`));
            }
        }

        port = ~~port;

        //创建请求对象
        var requestHandler = createRequestHandler(
            requestInterceptor,    //请求拦截器
            responseInterceptor,   //响应拦截器
            middlewares,           //中间件
            externalProxy          //外部代理
        );

        var upgradeHandler = createUpgradeHandler();

        //假服务器
        var fakeServersCenter = createFakeServerCenter({
            caCertPath,         //证书
            caKeyPath,          //证书key
            requestHandler,     //请求处理
            upgradeHandler,     //websocket处理
            getCertSocketTimeout //超时
        });

        var connectHandler = createConnectHandler(
            sslConnectInterceptor,   //ssl连接拦截
            fakeServersCenter        //假服务器处理
        );

        var server = new http.Server();
        server.listen(port, () => {
            console.log(colors.green(`node-mitmproxy启动端口: ${port}`));
            server.on('error', (e) => {
                console.error(colors.red(e));
            });
            server.on('request', (req, res) => {
                var ssl = false;
                requestHandler(req, res, ssl);
            });
            // tunneling for https
            server.on('connect', (req, cltSocket, head) => {
                connectHandler(req, cltSocket, head);
            });
            // TODO: handler WebSocket
            server.on('upgrade', function(req, socket, head) {
                var ssl = false;
                upgradeHandler(req, socket, head, ssl);
            });
        });
    },
    createCA(caBasePath = config.getDefaultCABasePath()) {
        return tlsUtils.initCA(caBasePath);
    }
}
