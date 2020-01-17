module.exports = {
    apps : [{
      name: 'TIMESTAMPING APP',
      script: 'node',
      args: ' ./bin/www',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }],
    deploy : {
      production : {
        user : 'node',
        host : 'localhost',
        ref  : 'origin/master',
        repo : 'git@github.com:repo.git',
        path : '/var/www/production',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
     }
    }
  };
