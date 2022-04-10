"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _winston.default.createLogger({
  level: 'debug',
  format: _winston.default.format.simple(),
  defaultMeta: {
    service: 'Dane-Proxy',
    timestamp: new Date().toISOString()
  },
  transports: [new _winston.default.transports.File({
    filename: './logs/debug.log',
    level: 'debug'
  }), new _winston.default.transports.File({
    filename: './logs/error.log',
    level: 'error'
  }), new _winston.default.transports.File({
    filename: './logs/combined.log'
  })]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new _winston.default.transports.Console({
    format: _winston.default.format.simple()
  }));
}

var _default = logger;
exports.default = _default;