const _ = require('lodash');

/**
 * decode topic for object and save to db
 * @param topic {String} event topic
 * @returns {Object}
 */
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

/**
 * Matches all required topics for map
 * @param topic {String} event topic
 * @param map {Object} key-value => topic-handler
 * @returns {Array}
 */
exports.getMapTopic = function(topic, map) {
  const list = [];
  const keys = Object.keys(map);
  for(let i = 0; i < keys.length; i++) {
    if (keys[i] === topic) {
      list.push(keys[i]);
      continue;
    }
    const kArray = _.remove(keys[i].split('/'), n => n !== '');
    const tArray = _.remove(topic.split('/'), n => n !== '');
    for (let j = 0; j < kArray.length; j++ ) {
      if(kArray[j] !== tArray[j] && kArray[j] !== '+' &&  kArray[j] !== '#'){
        break;
      }
      if (kArray[j] === '#' || (j === kArray.length -1 && kArray.length === tArray.length)) {
        list.push(keys[i]);
        break;
      }
    }
  }
  return list;
};
