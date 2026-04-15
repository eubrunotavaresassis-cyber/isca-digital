const { app, init } = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 4001;

// Ensure a secure JWT secret in production
const JWT_SECRET = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
  console.error('FATAL: JWT_SECRET must be set in production. Set the env var and restart.');
  process.exit(1);
}

function startServer(port) {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      setTimeout(() => startServer(port + 1), 200);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

init();
startServer(Number(PORT));
