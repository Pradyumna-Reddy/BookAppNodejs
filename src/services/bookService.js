const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug');

const parser = xml2js.Parser({ explicitArray: false });

function goodReadsService() {
  function getBookDetailsById() {
    return new Promise((resolve, reject) => {
      axios.get('/api')
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(result);
            } else {
              resolve(result);
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return { getBookDetailsById };
}

module.exports = goodReadsService();
