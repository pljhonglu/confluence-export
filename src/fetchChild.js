var moment = require('moment')
var config = require("./config")

const fetchChild = async (id) => {
  if (!id) { console.log('- 不给我Id叫我转什么?') }

  let deepGenTree = (results)=>{
    let tree = []
    if (results && results.length > 0){
      for (let index = 0; index < results.length; index++) {
        const result_item = results[index];
        let child_tree = []
        if (result_item['children'] && result_item['children']["page"] && result_item['children']["page"]["results"]){
          child_tree = deepGenTree(result_item['children']["page"]["results"])
        }
        tree.push({
          id: result_item.id,
          title: result_item.title,
          children: child_tree
        })
      }
    }
    return tree
  }
  const url = `${config.host}/rest/api/content/${id}/child?expand=page.children.page.children.page.children.page.children.page.children.page.children.page`
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${new Buffer(`${config.username}:${config.password}`).toString('base64')}`
    }
  })
  .then(res => res.json())
  .then(data => {
    let children = data["page"]["results"]
    return deepGenTree(children)
  })
}

module.exports = fetchChild
