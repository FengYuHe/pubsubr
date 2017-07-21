const test = require('ava');
const utils = require('../lib/utils');

test('utils => decode topic', t => {
  const topic = '/uid/123456789/model/Account/oid/1234567890/action/create';
  const data = utils.decodeTopic(topic);
  t.plan(5);
  t.is(Object.keys(data).length, 4);
  t.is(data.uid, '123456789');
  t.is(data.model, 'Account');
  t.is(data.oid, '1234567890');
  t.is(data.action, 'create');
});

test('utils => get map topic', t => {
  const topic = '/uid/123456789/model/Account/oid/1234567890/action/create';
  const map = {
    '/uid/123456789/model/Account/oid/1234567890/action/create': 'a',
    '/uid/123456789/model/Account/oid/1234567890/action/+': 'b',
    '/uid/+/model/+/oid/+/action/+': 'c',
    '/uid/+/model/#': 'd',
    '/uid/123456789/model/Account/oid/1234567890/action/create/test': 'e',
  };
  const list = utils.getMapTopic(topic, map);
  t.is(list.length, 4);
  t.is(list[3], '/uid/+/model/#');
  t.not(list[3], '/uid/123456789/model/Account/oid/1234567890/action/create/test');
});