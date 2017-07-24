const pubsubr = require('../index');

const server = new pubsubr.server('mqtt://test.mosquitto.org');

server.publish('/test/123456789/model/Account/oid/987654321/action/create', {test: 'abc'});