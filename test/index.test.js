const test = require('ava');
const Server = require('../lib/server');
const Client = require('../lib/client');
const model = {
  create: function(d) {
    return d;
  }
};

const server = new Server('mqtt://test.mosquitto.org', model);
const client  = new Client('mqtt://test.mosquitto.org', 'http://baidu.com');

test.cb(t => {
  const topic = 'test/test';
  client.subscribe(topic, {time: new Date()}, t.end());
  server.publish(topic, 'some payload');
});

test.cb(t => {
  const topic = 'test/test';
  client.unsubscribe(topic, t.end());
});

