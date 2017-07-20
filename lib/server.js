const connect = require('./connect');
const utils = require('./utils');
const _ = require('lodash');

module.exports = exports = Server;

function Server (options, model) {
  this.options = options;
  this.model = model;
  this.connect = connect(options);
}
/**
 * Publish a message to a topic
 * @param topic is the topic to publish to, String
 * @param message is the message to publish, Buffer or String
 * @param opts is the options to publish with, including:
 *  * qos QoS level, Number, default 0
 *  * retain retain flag, Boolean, default false
 *  * dup mark as duplicate flag, Boolean, default false
 * @param cb - function (err), fired when the QoS handling completes, or at the next tick if QoS 0. An error occurs if client is disconnecting.
 */
Server.prototype.publish = function (topic, message, opts, cb) {
  if (typeof cb === "undefined") {
    cb = opts;
    opts = {};
  }
  message = typeof message === 'object' ? JSON.stringify(message) : message;
  if (this.model) {
    const data = _.assign(utils.decodeTopic(topic), {topic, message, createdAt: new Date(), updatedAt: new Date()});
    this.model && this.model.create(data);
  }
  this.connect.publish(topic, message, opts, cb);
};
