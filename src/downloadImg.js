const fs = require('fs')
const request = require('request')
var config = require("./config")

function downloadImg (idAndName, dest) {
  var url = (/http:\/\//g).test(idAndName)
    ? idAndName :`${config.host}/download/attachments/${encodeURI(idAndName)}`
  return new Promise(function(resolve, reject){
    let file = fs.createWriteStream(dest)
    request.head(url, function (err, res, body) {
      request(url, {
        'auth': {
          user: config.username,
          pass: config.password
        }
      })
      .on('error', (err) => reject(err))
      .on('finish', () => file.close())
      .on('close', ()=> resolve())
      .pipe(file)
    })
  })
}

module.exports = downloadImg
