import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './src/main.server';
// require('dotenv').config();

// const environment = process.env['ENVIRONMENT']; // 'dev', 'preprod', 'prod'
// let API_URL;

// switch(environment) {
//   case 'dev':
//       API_URL = process.env['API_URL_DEV'];
//       break;
//   case 'preprod':
//       API_URL = process.env['API_URL_PREPROD'];
//       break;
//   case 'prod':
//       API_URL = process.env['API_URL_PROD'];
//       break;
//   default:
//       API_URL = process.env['API_URL_DEV']; // URL par défaut
// }

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/the-tiptop-front/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve the PWA manifest and the Angular service worker
  server.get('/manifest.webmanifest', (req, res) => {
    res.sendFile(join(distFolder, 'manifest.webmanifest'));
  });

  server.get('/ngsw-worker.js', (req, res) => {
    res.sendFile(join(distFolder, 'ngsw-worker.js'));
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default bootstrap;