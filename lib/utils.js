const _ = require('lodash');

exports.decodeTopic = function  (topic) {
  const arr = topic.split('/');
  _.remove(arr, (n) => {
    return n === '';
  });
  const d = {};
  for(let i = 0; i < arr.length; i += 2) {
    d[arr[i]] = arr[i+1];
  }
  return d;
};