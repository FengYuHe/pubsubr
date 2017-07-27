const test = require('ava');
const request = require('../lib/request');

test.cb(t => {
  request.reassembly('http://baidu.com', {}, t.end());
});