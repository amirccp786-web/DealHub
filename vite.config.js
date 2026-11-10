import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  plugins: [
    {
      name: 'dealhub-auto-save-plugin',
      configureServer(server) {
        server.middlewares.use('/api/save-deal', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const deal = JSON.parse(body);
                const dataJsPath = path.resolve(__dirname, 'js/data.js');
                let content = fs.readFileSync(dataJsPath, 'utf8');

                const marker = 'const INITIAL_DEALS = [';
                if (content.includes(marker)) {
                  // Format as neat indented object
                  const dealCode = `\n  ${JSON.stringify(deal, null, 2).replace(/\n/g, '\n  ')},`;
                  content = content.replace(marker, marker + dealCode);
                  fs.writeFileSync(dataJsPath, content, 'utf8');
                  console.log(`[DealHub Server] Deal "${deal.title}" permanently saved to js/data.js!`);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Deal permanently saved to data.js on disk!' }));
              } catch (err) {
                console.error('[DealHub Server] Error saving deal:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            res.writeHead(405);
            res.end();
          }
        });
      }
    }
  ]
});

