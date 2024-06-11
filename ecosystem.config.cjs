module.exports = {
  apps: [{
    name: "real-chatapp",
    script: "./backend/server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env_file: ".env"
  }]
};