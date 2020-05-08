const downloadImg = require('./downloadImg')
const chalk = require('chalk')

function handleImg (id, body) {
  var newbody = body
  let allPromise = []

  newbody = replace3(newbody, allPromise)
  while ((/ac:structured-macro/g).test(newbody)) {
    newbody = replace1(newbody, allPromise)
  }

  while ((/ac:image/g).test(newbody)) {
    newbody = replace2(newbody, allPromise)
  }

  function replace1 (page, allPromise) {
    var ac = (/<ac:structured-macro[\s\S]+?>([\s\S]+?)<\/ac:structured-macro>/g).exec(page)

    if ((/<ac:parameter ac:name="diagramName">([\s\S]*)<\/ac:parameter>/g).test(ac[1])) {
      var imgName = (/<ac:parameter ac:name="diagramName">([\s\S]+?)<\/ac:parameter>/g).exec(ac[1])[1]
      imgName = imgName.replace(/[ :]/g, '')
      allPromise.push(downloadImg(`${id}/${imgName}.png`, `./build/${id}/${imgName}.png`))
      imgName = imgName.replace('?', '%3F')
      return page.replace(ac[0], `<img src='./${imgName}.png' />`)
    } else {
      var code = ac[1].replace(/<ac:parameter[\s\S]+?>[\s\S]+?<\/ac:parameter>/g, '')
      code = code.replace(/ac:plain-text-body|ac:rich-text-body/g, 'pre')
      return page.replace(ac[0], code)
    }
  }

  function replace2 (page, allPromise) {
    var ac = (/<ac:image[\s\S]*?>([\s\S]+?)<\/ac:image>/g).exec(page)
    var imgName = ''

    if ((/ri:filename=/g).test(ac[1])) {
      imgName = (/ri:filename="([\s\S]+?)"/g).exec(ac[1])[1]
    } else if ((/ri:value=/g).test(ac[1])) {
      imgName = (/ri:value="([\s\S]+?)"/g).exec(ac[1])[1]
    }

    var url = (/http:\/\//g).test(imgName) ? imgName : `${id}/${imgName}`
    imgName = (/http:\/\//g).test(imgName) ? (/[\s\S]*\/([\s\S]*.png)/g).exec(imgName)[1] : imgName
    imgName = imgName.replace(/[ :]/g, '')
    allPromise.push(downloadImg(url, `./build/${id}/${imgName}`))
    imgName = imgName.replace('?', '%3F')
    img = `<img src="./${imgName}" />`
    return page.replace(ac[0], img)
  }

  function replace3 (page, allPromise) {
    return page.replace(/(<img[\s\S]+?src=")([\s\S]+?)(">)/g, (match, s1, s2, s3) => {
      const src = s2
      let imgName = decodeURI((/[\s\S]*\/([\s\S]*)/g).exec(s2)[1])
      allPromise.push(downloadImg(src, `./build/${id}/${imgName}`))
      imgName = imgName.replace('?', '%3F')
      return `${s1}${imgName}${s3}`
    })
  }
  return Promise.all(allPromise).then(()=> {
    return newbody
  }).catch(err => {
    console.log(`- got ${id} image error ${err}!`);
  }).finally(() => {
    return newbody
  })
}

module.exports = handleImg
