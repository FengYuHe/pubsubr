const request = require('request');
const utils = require('./utils');

exports.reassembly = function(api, where, handler) {
  let filter = {where};
  filter = JSON.stringify(filter);
  request(`${api}?filter=${filter}`, function (err, res, result) {
    result = JSON.parse(result);
    if (err) throw err;
    result.forEach((item) => {
      const payload = utils.decodeTopic(item.topic);
      let message = item.message;
      try {
        message = JSON.parse(message);
      } catch (err) {}
      payload.message = message;
      handler(null, payload);
    });
  });
};