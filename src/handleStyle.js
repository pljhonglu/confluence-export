const fs = require('fs')

function handleStyle (body, title) {
  let newbody = `
    <head>
      <meta charset="utf-8" /> 
      <link href="http://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet">
      <link href="../asset/style.css" rel="stylesheet">
      <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js"></script>
      <script src="../asset/sider.js"></script>
      </head>
    <body>
      <div class="catalog" id="sider"></div>
      <div class='main-view'>
        <h1 style='margin: 30px 0 50px;'>${title}</h1>
        ${body}
      </div>
    </body>
  `
  return newbody
}

module.exports = handleStyle
