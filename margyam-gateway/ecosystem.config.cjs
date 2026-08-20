module.exports = {
  apps: [
    {
      name:         'margyam-gateway',
      script:       'app.js',
      instances:    'max',            // Cluster mode: one process per CPU core
      exec_mode:    'cluster',
      watch:        false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
      error_file:   './logs/error.log',
      out_file:     './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
