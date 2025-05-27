export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: { 
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false)
      }
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 1),
      max: env.int('DATABASE_POOL_MAX', 3),
      acquireTimeoutMillis: env.int('DATABASE_ACQUIRE_TIMEOUT', 60000)
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000)
  }
});