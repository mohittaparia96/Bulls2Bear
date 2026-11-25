// Local development database: a self-contained PostgreSQL that runs from node_modules (no install needed).
// Usage:  npm run db:local     (leave it running in its own terminal, then `npm run dev` in another)
// Data is stored in ./.localdb (git-ignored). Matching .env values:
//   DB_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/bulls2bear"
//   DB_DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5433/bulls2bear"
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('.localdb');
const pg = new EmbeddedPostgres({
  databaseDir: dir, user: 'postgres', password: 'postgres', port: 5433, persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'], // UTF-8 so emoji and ₹ store correctly (Windows defaults to WIN1252)
});

if (!existsSync(dir)) await pg.initialise();
await pg.start();
try { await pg.createDatabase('bulls2bear'); } catch { /* already exists */ }
console.log('Local Postgres running on postgresql://postgres:postgres@localhost:5433/bulls2bear  (Ctrl+C to stop)');

const stop = async () => { await pg.stop(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
