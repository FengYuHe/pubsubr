const mqtt = require('mqtt');
const _ = require('lodash');

module.exports = function (options) {
  options = options || {host: 'localhost', port: '1883'};
  if (typeof options === "object") {
    options = _.pick(options, ['host', 'port']);
  }
  const connect  = mqtt.connect(options);
  return connect;
};
