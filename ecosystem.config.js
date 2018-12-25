module.exports = {
  apps : [
    {
      name: "rectangle-generator",
      script: "./index.js",
      watch: true,
      env: {
        "POSITION": "1",
        "FREQ": "200",
      }
    }
  ]
};
