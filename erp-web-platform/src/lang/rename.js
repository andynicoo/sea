'use strict';//严格模式

let fs = require('fs'); 

let  src = 'module';//定义一个想修改文件所在的文件夹的路径，相对改js文件

fs.readdir(src,function(err,files){ 
    let i = 1;
    files.forEach(function(filename){ 
        if(filename.indexOf('.zh') != -1){ 
            let oldPath = src + '/' + filename
            let newPath = (src + '/' + filename).replace(/.zh./g, '.'); 
            i++;
            fs.rename(oldPath, newPath, function(err){ 
            if(!err){//替换成功，提示信息
                console.log(newPath + '替换成功！');
                }
            })
        }
    })
})