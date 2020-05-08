require('dotenv').load()
require('es6-promise').polyfill()
require('isomorphic-fetch')
const chalk = require('chalk')
const fs = require('fs-extra')
const fetchChild = require('./src/fetchChild')
const fetchPage = require('./src/fetchPage')
const handleImg = require('./src/handleImg')
const handleStyle = require('./src/handleStyle')
const handleBody = require('./src/handleBody')
const insertCatalog = require('./src/insertCatalog')

require('figlet').text('Confluence2K', (e, data) => console.log(e || data))
const id = process.argv[2]
const name = process.argv[3]

fs.ensureDirSync("./build")
fs.emptyDirSync("./build")
fs.copySync("./src/asset/", "./build/asset/")

let fetchTree = async(tree)=>{
  for (let index = 0; index < tree.length; index++) {
    const element = tree[index];
    await getPage(element.id)
    if(element.children.length > 0){
      await fetchTree(element.children)
    }
  }
}

fetchChild(id).then((tree) => {
  insertCatalog(tree, name)
  fetchTree(tree)
}).catch(err => {
  console.log(err)
})

function getPage (child) {
  console.log(`- get page ${child}`);
  fs.ensureDirSync(`./build/${child}`)
  fetchPage(child).then((page) => {
    fs.writeFileSync(`./build/${child}/_tmp.html`, page)
    let newbody = handleBody(page.body)
    newbody = handleStyle(newbody, page.title)
    return newbody
  }).then((body) => {
    return handleImg(child, body)
  }).then((body) => {
    fs.writeFileSync(`./build/${child}/index.html`, body)
    console.log(`- got ${child} finished!`);
  }).catch((err) => {
    console.log(`- got ${child} error ${err}!`);
  })
}
