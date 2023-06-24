// session.config.ts
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';

export const sessionConfig: session.SessionOptions = {
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Set to true if served over HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    sameSite: 'strict', // or 'lax'
  },
  store: new (pgSession(session))({
    conObject: {
      connectionString: 'your-postgres-connection-string',
    },
  }),
};
