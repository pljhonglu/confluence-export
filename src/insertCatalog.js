const fs = require('fs')

function insertCatalog (tree, name) {
  var fristPage = 99999999

  var link = (id, title, hasChild) => {
    fristPage = +id < fristPage ? id : fristPage
    return `<a class="link ${hasChild ? 'has-child': ''}" href="../${id}/index.html">${title}</a>`
  }

  var Tree = (tree) => {
    let cata = ''
    for (let index = 0; index < tree.length; index++) {
      const element = tree[index];
      if (element.children.length > 0) {
        var leafs = Tree(element.children)
        cata += `
          ${link(element.id, element.title, 1)}
          <ul class='cata-ul'>${leafs}</ul>`
      } else {
        cata += `${link(element.id, element.title, 0)}`
      }
    }
    return cata
  }

  let siderContent = `
  function heredoc(fn) {
    return fn.toString().split('\\n').slice(1,-1).join('\\n') + '\\n'
  }
  var siderHtml = heredoc(function(){/*
    <h1 class='title'>${name}</h1>
    <h3 style='padding-left: 20px;'>目录</h3>
    ${Tree(tree)}
  */})
  $(function(){
    $("#sider").html(siderHtml);
  })
`
  fs.writeFileSync("./build/asset/sider.js", siderContent)
  var landPage = `<script>location.href = './${fristPage}/index.html'</script>`
  fs.writeFileSync("./build/index.html", landPage)
}

module.exports = insertCatalog
