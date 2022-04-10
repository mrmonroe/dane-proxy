/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-use-before-define */
import net, { Server } from 'net';
import logger from './logger';

interface ServerListeningPromise {
  promise: Promise<any>;
  resolve: Function;
  reject: Function;
}
interface IOptions {
  port?: number;
  server?: string;
}

export default class ProxyServer {
  public port?: number;

  public server?: Server;

  public serverListeningPromise: ServerListeningPromise;

  public options: IOptions;

  public fromSock: any;

  public toSock: any;

  constructor(opts?: IOptions) {
    this.options = opts || {};
    this.port = this.options.port || 8080;
    this.serverListeningPromise = {} as any;
    this.serverListeningPromise.promise = new Promise((resolve, reject) => {
      this.serverListeningPromise.resolve = resolve;
      this.serverListeningPromise.reject = reject;
    });
    this.server = this.createProxy(this.options);
  }

  public awaitStartedListening() {
    return this.serverListeningPromise.promise;
  }

  public createProxy = (options: IOptions): any => {
    let toSock: any;
    try {
      const server = net.createServer((fromSock: any) => {
        fromSock.on('data', (req) => {
          toSock = this.handleFromSockData(req);

          fromSock.pipe(toSock);
          toSock.pipe(fromSock);
        });
      });
      // piping here
      //this.pipeSockets(fromSock, toSock);

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
          console.log(`Dane-Proxy listening on: -->> Port:${options.port}`);
          if (this.serverListeningPromise) {
            return this.serverListeningPromise.resolve;
          }
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
  }; // end createProxy

  handleConnect = (): void => {
    // throw new Error('Function not implemented.');
    console.log('handle Connection');
  };

  handleError = (err): void => {
    // throw new Error('Function not implemented.');
    console.log('handle Error', err);
  };

  handleClose = (): void => {
    console.log('handle Close');
  };

  handleFromSockData = (req: any) => {
    const data = req.toString('utf-8');
    console.log(data);
    const parsedData = this.parseData(data);
    console.log(parsedData);
    const toSock = this.handleRemoteConnection(parsedData.address, parsedData.port);

    return toSock;
  };

  handleRemoteConnection = (address: string, prt: number): net.Socket => {
    console.log(address, prt);
    const to = net.createConnection({
      host: address,
      port: prt,
    });
    return to;
  };

  pipeSockets = (from: any, to: any) => {
    from.pipe(to);
    to.pipe(from);
  };

  parseData = (data: any): any => {
    const isConnectMethod = data.indexOf('CONNECT') !== 1;
    let serverPort: number = 80;
    let serverAddress: string;

    if (!isConnectMethod) {
      const d = data.split('CONNECT ')[1].split(' ')[0].split(':');
      serverAddress = d[0];
      serverPort = parseInt(d[1]) || 443;
    } else {
      try {
        serverAddress = data.toLowerCase().split('host: ')[1];

        serverAddress = serverAddress.split('\r\n')[0];
        const serverAddressSplit = serverAddress.split(':');
        serverAddress = serverAddressSplit[0];
        serverPort = parseInt(serverAddressSplit[1]);
        return { address: serverAddress, port: serverPort };
      } catch (e) {
        logger.debug('Data parsing error', e);
        throw new Error(`Data parsing error: ${e}`);
      }
    }
  };
}
