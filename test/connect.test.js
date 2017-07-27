const test = require('ava');
const connect = require('../lib/connect');

test(t => {
  connect();
  t.pass();
});