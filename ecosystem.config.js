module.exports = {
  apps: [
    {
      name: 'excel-import',
      script: './app.js',
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
};
