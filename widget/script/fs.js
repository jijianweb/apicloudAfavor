/*
 * fs封装了对文件操作的接口，通过此模块可对文件进行创建、删除，读取、写入等相关操作
 */
!function(window){
	var f = {
		createDir: function(path, callback){
			/*创建目录
			 * path 目标路径
			 */
			var fs = api.require('fs');
			fs.createDir({
				path: path
			}, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}
			});
		},
		createFile: function(path, callback){
			/*创建文件
			 * path 目标路径
			 */
			var fs = api.require('fs');
			fs.createFile({
				path: path
			}, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}
			});
		},
		remove: function(path, callback){
			/*删除文件
			 * path 目标路径
			 */
			var fs = api.require('fs');
			fs.remove({
				path: path
			}, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}
			});			
		},
		copyTo: function(args, callback){
			/*拷贝文件
			 * args 内部结构
			 * 	oldPath 源路径
			 * 	newPath 目标路径
			 */
			var fs = api.require('fs');
			fs.copyTo(args, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}				
			});
		},
		moveTo: function(args, callback){
			/*移动文件
			 * args 内部结构
			 * 	oldPath 源路径
			 * 	newPath 目标路径
			 */
			var fs = api.require('fs');
			fs.moveTo(args, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}				
			});			
		},
		rename: function(args, callback){
			/*重命名
			 * args 内部结构
			 * 	oldPath 源路径
			 * 	newPath 目标路径
			 */
			var fs = api.require('fs');
			fs.moveTo(args, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}				
			});				
		},
		readDir: function(path, callback){
			/*列出目录
			 * path 目标路径
			 * 
			 * @return
			 * 	data 文件夹内的所有子文件名称，数组类型
			 */
			var fs = api.require('fs');
			fs.readDir({
				path: path
			}, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback(ret);
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}
			});			
		},
		open: function(args, callback){
			/*打开文件
			 * args 内部结构
			 *  path 目标路径
			 * 	flags['read'] 文件打开方式
			 * 		read //只读
			 * 		write //只写
			 * 		read_write //读写
			 * 
			 * @return
			 * 	fd 文件句柄
			 */
			var fs = api.require('fs');
			fs.open(args, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback(ret);
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}
			});
		},
		read: function(args, callback){
			/*读取文件
			 * args 内部结构
			 * 	fd open方法得到的文件句柄
			 * 	offset[0] 当前文件偏移量
			 * 	length[0] 读取内容长度
			 * 	codingType['utf8'] 所要阅读的文本的编码格式
			 * 
			 * @return
			 * 	data 文件内容，字符串
			 */
			var fs = api.require('fs');
			fs.read(args, function(ret, err){
				if(ret.status){
					if(typeof callback === 'function'){
						callback(ret);
					}
				}else{
					if(err && err.code){
						api.toast({
							msg: err.code + '-' + err.msg
						});
					}
				}				
			});
		}
	};
	window.FS = f;
}(window)
