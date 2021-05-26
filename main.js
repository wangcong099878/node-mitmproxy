var mitmproxy = require('./src/index');

mitmproxy.createProxy({
    sslConnectInterceptor: (req, cltSocket, head) => true,
    requestInterceptor: (rOptions, req, res, ssl, next) => {
        //console.log(`正在访问：${rOptions.protocol}//${rOptions.hostname}:${rOptions.port}`);
        //console.log('cookie:', rOptions.headers.cookie);

        //这里拦截一下
        //res.end('Hello node-mitmproxy!');
        next();
    },
    responseInterceptor: (req, res, proxyReq, proxyRes, ssl, next) => {


        //https://nodejs.org/api/http.html#http_class_http_incomingmessage
        //https://nodejs.org/api/http.html#http_class_http_incomingmessage
        //https://nodejs.org/api/http.html#http_class_http_incomingmessage
        //res.body
        next();
    }
});