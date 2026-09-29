import { app } from './app';
import { connectDB, disconnectDB } from './lib/mongoose';
import { env } from './config/env';
async function start(): Promise<void> {
  await connectDB();
  const server = app.listen(env.port, '0.0.0.0', () => console.log(`Flanchito space en puerto ${env.port}`));
  const stop = () => server.close(() => { void disconnectDB().then(() => process.exit(0)); });
  process.once('SIGTERM', stop);
  process.once('SIGINT', stop);
}
start().catch(() => { console.error('No fue posible iniciar Flanchito space. Revisa la configuración y MongoDB.'); process.exit(1); });
