"use strict";

var _ProxyServer = _interopRequireDefault(require("./ProxyServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  var serve = new _ProxyServer.default({
    port: 8080
  });
} catch (e) {
  throw new Error('Cannot Start check dependencies');
}