/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-use-before-define */
import net, { Socket } from 'net';
import logger from './logger';

export default class ProxySocket extends Socket {
  protected connection;

  port: any;

  host: any;

  remoteHostAndPort: any;

  constructor(port, host) {
    super();
    this.port = port;
    this.host = host;
    this.connection = this.connectAndLoop({ port: this.port, host: this.host });
  }

  connectAndLoop(port, host) {
    return net.createConnection({ port, host });
  }

  registerLoop() {
    // tried to put these in order as they appear in the loop
    // but the loop is dependent upon the contents of the req and res
    this.connection.on('connect', () => {});
    this.connection.on('ready', () => {});
    this.connection.on('data', () => {});
    this.connection.on('drain', () => {});
    this.connection.on('end', () => {});
    this.connection.on('close', () => {});
    this.connection.on('timeout', () => {});
    this.connection.on('error', () => {});
  }

  getConnectHostAndPort = (data: any): any => {
    const isConnectMethod = data.indexOf('CONNECT') !== 1;
    let serverPort: number = 80;
    let serverAddress: string;
    try {
      if (!isConnectMethod) {
        const d = data.split('CONNECT ')[1].split(' ')[0].split(':');
        serverAddress = d[0];
        serverPort = parseInt(d[1], 10) || 443;
      } else {
        serverAddress = data.toLowerCase().split('host: ')[1];
        serverAddress = serverAddress.split('\r\n')[0];
        const serverAddressSplit = serverAddress.split(':');
        serverAddress = serverAddressSplit[0];
        serverPort = parseInt(serverAddressSplit[1], 10);
      }
      return { address: serverAddress, port: serverPort };
    } catch (e) {
      logger.debug('Data parsing error', e);
      throw new Error(`Data parsing error: ${e}`);
    }
  };
}

/*

    let toSock: any;
    try {
      const server = net.createServer((fromSock: any) => {
        fromSock.on('data', (req: any) => {
          const data = req.toString('utf-8');
          toSock = this.handleFromSockData(data);
          toSock.write('HTTP/1.1 200 Connection Established\r\n  \r\n');
          //  Proxy-agent: Dane-Proxy\r\n
          fromSock.pipe(toSock);
          toSock.pipe(fromSock);
          toSock.emit('end');
          fromSock.emit('end');
          toSock.end();
          fromSock.end();
        });
      });

      server.on('connect', () => {
        this.handleConnect();
      });

      server.on('error', (err) => {
        this.handleError(err);
      });

      server.on('close', () => {
        this.handleClose();
      });

      if (options.port) {
        server.listen(options.port, () => {
          if (this.serverListeningPromise) {
            return this.serverListeningPromise.resolve;
          }
          return 1;
        });
      } else {
        logger.error('NO PORT');
        return -1;
      }
      return server;
    } catch (err) {
      logger.error(err);
      console.log('getting here');
      return -1;
    }
    */
