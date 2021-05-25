//cd ~/node-mitmproxy

//node-mitmproxy.ca.crt
//node-mitmproxy.ca.key.pem
//

//window
//start %HOMEPATH%/node-mitmproxy/node-mitmproxy.ca.crt

//mac
//sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/node-mitmproxy/node-mitmproxy.ca.crt

//node-mitmproxy -c simpleConfig.js
module.exports = {
    sslConnectInterceptor: (req, cltSocket, head) => true,
    requestInterceptor: (rOptions, req, res, ssl, next) => {
        //console.log(`正在访问：${rOptions.protocol}//${rOptions.hostname}:${rOptions.port}`);
        //console.log('cookie:', rOptions.headers.cookie);
        //res.end('hello node-mitmproxy!');
        next();
    }
};