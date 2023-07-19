#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const needle = require('needle')
const filePath = path.resolve('./src/lang/module') //源目录
const targetPath = path.resolve('./src/lang/test') //目标目录

const log = require('./log.js')

const langOptions = ['en', 'in', 'ma', 'pt', 'th', 'vi', 'zhtw']

const ERP_TOKEN = 'Bearer d2e1b155-b1f5-48f9-aa8f-2667bc20863f'

const writeFileRecursive = async function(path, buffer, callback) {
  let lastPath = path.substring(0, path.lastIndexOf('/'))
  fs.mkdir(lastPath, { recursive: true }, (err) => {
    if (err) return callback(err)
    fs.writeFile(path, buffer, function(err) {
      if (err) return callback(err)
      return callback(null)
    })
  })
}

//文件遍历方法
const fileDisplay = async function(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        const filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, async function(eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            let isFile = stats.isFile() //是文件
            let isDir = stats.isDirectory() //是文件夹
            if (isFile) {
              // console.log(filedir) // 文件绝对路径
              const content = fs.readFileSync(filedir, 'utf-8')
              // console.log(content) // 文件内容
              if (/brand/.test(filename)) {
                let { source, target } = await handleTranslation(
                  filename,
                  content
                )
                let targetContent = await generateTargetLangContent(
                  source,
                  target
                )
                await handleWriteSingleLangFile(filename, targetContent)
              }
            }
            if (isDir) {
              fileDisplay(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}

const handleTranslation = async function(filename, content) {
  const batchTranslateUrl =
    'https://erp.emalacca.com/api/goods/goods/shopee/product/translate/batch'
  return new Promise((resolve, reject) => {
    let matchContent = content
      .match(/\{[\S\s]+\}/)[0]
      .replace(/{/, '')
      .replace(/}$/, '')
    // console.log(matchContent, 'matchContent')
    try {
      let sourceList = matchContent.split(/,\n/).map((el, index) => {
        return {
          attr: el.split(':')[0].replace(/\s+/g, ''),
          source: el.match(/["|'](.*)["|']/)[1].replace(/\s+/g, ''),
          target: null,
          translateId: 10 + index,
          countryCode: 'MY'
        }
      })
      let params = {
        list: sourceList
      }

      needle.post(
        batchTranslateUrl,
        params,
        {
          content_type: 'application/json',
          headers: {
            Authorization: ERP_TOKEN
          }
        },
        function(err, resp, body) {
          if (body && body.code && body.code == 0) {
            resolve({ source: sourceList, target: body.data.list })
          }
        }
      )
    } catch (error) {
      log(`有问题的文件${filename},${error}`, { font: 'red' })
    }
  })
}

// 写入一个文件
const handleWriteSingleLangFile = async function(sourceFilename, content) {
  langOptions.map((el) => {
    let targetFileName = sourceFilename.replace(/zh/, el)
    writeFileRecursive(
      `${targetPath}/module${el}/${targetFileName}`,
      content,
      (err) => {
        if (err) console.error(err)
        log(`【${targetFileName}】写入成功`, { font: 'green' })
      }
    )
  })
}

// 根据翻译前后内容属性生成目标语言内容
const generateTargetLangContent = async function(source, target) {
  const baseExport = `export default `
  const langObject = {}
  source.map((el) => {
    langObject[el.attr] = target.find(
      (item) => item.translateId == el.translateId
    ).target
  })
  return baseExport + JSON.stringify(langObject, null, 4)
}

//调用文件遍历方法
fileDisplay(filePath)
