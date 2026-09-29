import 'dotenv/config';
function secret(name: string): string {
  const value = process.env[name];
  if (!value || value.length < 32) throw new Error(`${name}: se requieren al menos 32 caracteres`);
  return value;
}
export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? '',
  production: process.env.NODE_ENV === 'production',
  accessSecret: secret('JWT_ACCESS_SECRET'),
  refreshSecret: secret('JWT_REFRESH_SECRET'),
  origins: (process.env.CORS_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean),
};
if (!env.mongoUri) throw new Error('Configura MONGODB_URI');
if (env.accessSecret === env.refreshSecret) throw new Error('Los secretos JWT deben ser distintos');
if (!env.origins.length || env.origins.includes('*')) throw new Error('CORS requiere orígenes explícitos');
