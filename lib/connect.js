const mqtt = require('mqtt');

module.exports = function (options) {
  options = options || {host: 'localhost', port: '1883'};
  const connect  = mqtt.connect(options);
  return connect;
};
