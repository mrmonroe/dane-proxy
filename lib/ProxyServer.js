"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _net = _interopRequireDefault(require("net"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProxyServer {
  constructor(opts) {
    _defineProperty(this, "port", void 0);

    _defineProperty(this, "server", void 0);

    _defineProperty(this, "serverListeningPromise", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "fromSock", void 0);

    _defineProperty(this, "toSock", void 0);

    _defineProperty(this, "createProxy", options => {
      var toSock;

      try {
        var server = _net.default.createServer(fromSock => {
          fromSock.on('data', req => {
            toSock = this.handleFromSockData(req);
            fromSock.pipe(toSock);
            toSock.pipe(fromSock);
          });
        });

        server.on('connect', () => {
          this.handleConnect();
        });
        server.on('error', err => {
          this.handleError(err);
        });
        server.on('close', () => {
          this.handleClose();
        });

        if (options.port) {
          server.listen(options.port, () => {
            console.log("Dane-Proxy listening on: -->> Port:".concat(options.port));

            if (this.serverListeningPromise) {
              return this.serverListeningPromise.resolve;
            }
          });
        } else {
          _logger.default.error('NO PORT');

          return -1;
        }

        return server;
      } catch (err) {
        _logger.default.error(err);

        console.log('getting here');
        return -1;
      }
    });

    _defineProperty(this, "handleConnect", () => {
      console.log('handle Connection');
    });

    _defineProperty(this, "handleError", err => {
      console.log('handle Error', err);
    });

    _defineProperty(this, "handleClose", () => {
      console.log('handle Close');
    });

    _defineProperty(this, "handleFromSockData", req => {
      var data = req.toString('utf-8');
      console.log(data);
      var parsedData = this.parseData(data);
      console.log(parsedData);
      var toSock = this.handleRemoteConnection(parsedData.address, parsedData.port);
      return toSock;
    });

    _defineProperty(this, "handleRemoteConnection", (address, prt) => {
      console.log(address, prt);

      var to = _net.default.createConnection({
        host: address,
        port: prt
      });

      return to;
    });

    _defineProperty(this, "pipeSockets", (from, to) => {
      from.pipe(to);
      to.pipe(from);
    });

    _defineProperty(this, "parseData", data => {
      var isConnectMethod = data.indexOf('CONNECT') !== 1;
      var serverPort = 80;
      var serverAddress;

      if (!isConnectMethod) {
        var d = data.split('CONNECT ')[1].split(' ')[0].split(':');
        serverAddress = d[0];
        serverPort = parseInt(d[1]) || 443;
      } else {
        try {
          serverAddress = data.toLowerCase().split('host: ')[1];
          serverAddress = serverAddress.split('\r\n')[0];
          var serverAddressSplit = serverAddress.split(':');
          serverAddress = serverAddressSplit[0];
          serverPort = parseInt(serverAddressSplit[1]);
          return {
            address: serverAddress,
            port: serverPort
          };
        } catch (e) {
          _logger.default.debug('Data parsing error', e);

          throw new Error("Data parsing error: ".concat(e));
        }
      }
    });

    this.options = opts || {};
    this.port = this.options.port || 8080;
    this.serverListeningPromise = {};
    this.serverListeningPromise.promise = new Promise((resolve, reject) => {
      this.serverListeningPromise.resolve = resolve;
      this.serverListeningPromise.reject = reject;
    });
    this.server = this.createProxy(this.options);
  }

  awaitStartedListening() {
    return this.serverListeningPromise.promise;
  }

}

exports.default = ProxyServer;