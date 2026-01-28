module.exports = {
  apps: [{
    name: 'confial',
      user: 'sviluppatore',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/projects/confial',
    env: {
      NODE_ENV: 'production',
      PORT: 3020
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '500M',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    time: true
  }]
};
