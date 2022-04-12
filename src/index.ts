import ProxyServer from './ProxyServer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
try {
  const serve: ProxyServer = new ProxyServer({ port: 8080 });
  if (serve) {
    console.log('Dane Proxy is listening!', 8080);
  }
} catch (e) {
  throw new Error('Cannot Start check dependencies');
}
