module.exports = {
  apps: [
    {
      name: 'Mediva-App',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',

      // Clustering configurations for high availability
      exec_mode: 'cluster',
      instances: '1',
      autorestart: true, // Auto-restart if application crashes unexpectedly
      watch: false, // Disable watching in production for lower memory/CPU overhead
      max_memory_restart: '3G', // Recycle worker instances exceeding 3GB memory limit

      env: {
        PORT: 3011,
        NODE_ENV: 'production',
      },

      env_production: {
        PORT: 3011,
        NODE_ENV: 'production',
        // DB URLs will be parsed dynamically inside our db-sso.ts / db-timker.ts from process.env
        //    # =====================================
        // # DATABASE UTAMA
        // # =====================================
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        //    # =====================================
        // # DATABASE TIMKER
        // # =====================================
        DB_HOST_timker4: process.env.DB_HOST_timker4,
        DB_USER_timker4: process.env.DB_USER_timker4,
        DB_PASSWORD_timker4: process.env.DB_PASSWORD_timker4,
        DB_NAME_timker4: process.env.DB_NAME_timker4,
        DB_PORT_timker4: process.env.DB_PORT_timker4,
        //    # =====================================
        // # DATABASE SSO
        // # =====================================
        DB_HOST_sso: process.env.DB_HOST_sso,
        DB_USER_sso: process.env.DB_USER_sso,
        DB_PASSWORD_sso: process.env.DB_PASSWORD_sso,
        DB_NAME_sso: process.env.DB_NAME_sso,
        DB_PORT_sso: process.env.DB_PORT_sso,
        //    # =====================================
        // # JWT & ENCRYPTION KEYS
        // # =====================================
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
          process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY,
        SESSION_SECRET: process.env.SESSION_SECRET,
      },

      // Log formatting and tracking specs a
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
