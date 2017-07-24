const pubsubr = require('../index');

const client = new pubsubr.client('mqtt://test.mosquitto.org');

client.subscribe('/test/+/model/+/oid/+/action/+', function(err, payload) {
  console.log(err);
  console.log(payload);
});