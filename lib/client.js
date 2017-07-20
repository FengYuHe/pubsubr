const connect = require('./connect');
const utils = require('./utils');

module.exports = exports = Client;

function Client(options, apiUrl) {
  this.options = options;
  this.apiUrl = apiUrl;
  this.connect = connect(options);
  this.map = {};
  this.connect.on('message', (topic, message) => {
    const payload = utils.decodeTopic(topic);
    try {
      message = JSON.parse(message);
    } catch (err) {}
    payload.message = message;
    const keys = utils.getMapTopic(topic, this.map);
    keys.forEach((item) => {
      this.map[item](null, payload);
    })
  });
}

/**
 * Subscribe to a topic or topics
 * @param topic topic is a String topic to subscribe to or an Array of topics to subscribe to. It can also be an object,
 * it has as object keys the topic name and as value the QoS, like {'test1': 0, 'test2': 1}.
 * MQTT topic wildcard characters are supported (+ - for single level and # - for multi level)
 * @param opts is the options to subscribe with, including:
 *  * qos qos subscription level, default 0
 * @param handler
 */
Client.prototype.subscribe = function (topic, opts, handler) {
  if (typeof handler === "undefined") {
    handler = opts;
    opts = {};
  }
  this.connect.subscribe(topic, opts);
  this.map[topic] = handler;
};

/**
 * Unsubscribe from a topic or topics
 * @param topic is a String topic or an array of topics to unsubscribe from
 * @param cb  - function (err), fired on unsuback. An error occurs if client is disconnecting.
 */
Client.prototype.unsubscribe = function (topic, cb) {
  this.connect.unsubscribe(topic, cb);
};
