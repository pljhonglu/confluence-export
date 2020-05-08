var config = require("./config")

const fetchPage = (id) => {
  const url = `${config.host}/rest/api/content/${id}?expand=body.export_view`
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${new Buffer(`${config.username}:${config.password}`).toString('base64')}`
    }
  })
  .then(res => res.json())
  .then(data => {
    return {
      title: data.title,
      body: data.body.export_view.value
    }
  })
}

module.exports = fetchPage
