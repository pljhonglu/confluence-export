function handleBody(body) {
  let newbody = replace1(body)

  newbody = replace2(newbody)
  newbody = replace3(newbody)
  newbody = replace4(newbody)
  return newbody
  // this.page = replace5(this.page)
}

var replace1 = (page) => page.replace(/<p><\/p>/g, '')

var replace2 = (page) => page.replace(/<!\[CDATA\[|\]\]>/g, '')

var replace3 = (page) => {
  if ((/<ac:structured-macro[\s\S]+?\/>/g).test(page)) {
    var ac = (/<ac:structured-macro[\s\S]+?\/>/g).exec(page)[0]
    return (/></g).test(ac)
      ? page : page.replace(ac, '')
  }
  return page
}

var replace4 = (page) => {
  if ((/<ac:task-list>[\s\S]+?<\/ac:task-list>/g).test(page)) {
    return page.replace(/<ac:task-list>[\s\S]+?<\/ac:task-list>/g, '')
  }
  return page
}

module.exports = handleBody
