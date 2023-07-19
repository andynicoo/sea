var fs = require('fs')

//异步读取文件（）
fs.readFile('./zh.js', 'utf-8', function(err, data) {
  if (!err) {
    var zhContent = data.toString()
    var replaceContent = data.toString()

    var _zhtw = replaceContent.replace(/.\/module\//g, './modulezhtw/')
    _zhtw = _zhtw.replace('.zh', '.zhtw')
    var _en = replaceContent.replace(/.\/module\//g, './moduleen/')
    _en = _en.replace(/.zh/g, '.en')
    var _in = replaceContent.replace(/.\/module\//g, './modulein/')
    _in = _in.replace(/.zh/g, '.in')
    var _ma = replaceContent.replace(/.\/module\//g, './modulema/')
    _ma = _ma.replace(/.zh/g, '.ma')
    var _pt = replaceContent.replace(/.\/module\//g, './modulept/')
    _pt = _pt.replace(/.zh/g, '.pt')
    var _th = replaceContent.replace(/.\/module\//g, './moduleth/')
    _th = _th.replace(/.zh/g, '.th')
    var _vi = replaceContent.replace(/.\/module\//g, './modulevi/')
    _vi = _vi.replace(/.zh/g, '.vi')

    fs.writeFile('./zhtw.js', _zhtw, function(err) {
      if (!err) {
        console.log('zhtw.js')
      }
    })
    fs.writeFile('./en.js', _en, function(err) {
      if (!err) {
        console.log('en.js')
      }
    })
    fs.writeFile('./in.js', _in, function(err) {
      if (!err) {
        console.log('in.js')
      }
    })
    fs.writeFile('./ma.js', _ma, function(err) {
      if (!err) {
        console.log('ma.js')
      }
    })
    fs.writeFile('./pt.js', _pt, function(err) {
      if (!err) {
        console.log('pt.js')
      }
    })
    fs.writeFile('./th.js', _th, function(err) {
      if (!err) {
        console.log('th.js')
      }
    })
    fs.writeFile('./vi.js', _vi, function(err) {
      if (!err) {
        console.log('vi.js')
      }
    })
  }
})
