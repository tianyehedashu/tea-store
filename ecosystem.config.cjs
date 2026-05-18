/** PM2 process config for production on VPS (paths assume ~/tea-store). */
module.exports = {
  apps: [
    {
      name: "tea-backend",
      cwd: "/home/linuxuser/tea-store/backend",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "400M",
    },
    {
      name: "tea-front",
      cwd: "/home/linuxuser/tea-store/front",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "8000",
      },
      max_memory_restart: "400M",
    },
  ],
}
