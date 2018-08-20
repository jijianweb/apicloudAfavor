/*
 * 该模块是一个可定制数据源的城市列表
 * 模块根据数据源自动生成字母索引，点击字母索引快速滚动至目标数据，支持数据源搜索
 * 用于实现城市列表的展示，搜索，及导航功能
 */
!function(window){
	var cl = {
		open: function(args, callback){
			/*打开城市列表模块
			 * args 内部结构
			 * 	rect{ 模块的位置及尺寸
			 * 		x[0]
			 * 		y[0]
			 * 		w[api.frameWidth]
			 * 		h[api.frameHeight]
			 * 	}
			 * 	resource 城市列表的数据源文件(json)路径（支持 https、http、widget、fs 路径协议）
			 * 	style[style] 城市列表样式设置
			 * 	currentCity 显示当前所在城市，若传空或不传则当前城市行不显示
			 * 	locationWay['GPS定位'] 显示定位方式（紧跟在当前城市后面）
			 * 	hotTitle['热门城市'] 热门城市对应的标题
			 * 	placeholder['输入城市名或首字母查询'] 顶部搜索条占位提示文字
			 * 	show 模块打开成功后的回调
			 * 	selected 用户选择城市的回调
			 *
			 * @return
			 * 	eventType 交互事件类型
			 * 		show 模块打开成功
			 * 		selected 用户选择城市
			 * 	cityInfo{ 用户选择的城市信息，同传入的数据源格式相同
			 * 		id
			 * 		city
			 * 		pinyin
			 * 	}
			 */
			var cityList = api.require('UICityList'),
					style = {
							searchBar: {
							cancelText: 'Cancel',
				    		bgColor: '#C7C6CB'
				        },
				    	sectionTitle: {
				    		bgColor: '#eee',
				    		color: '#EE5979',
				    		size: 12,
				    		height: 25
				    	},
				    	item: {
				    		bgColor: '#fff',
				    		activeBgColor: '#ddd',
				    		color: '#000',
				    		size: 14,
				    		height: 40
				    	},
				    	indicator: {
				    		bgColor: '#fff',
				    		color: '#EE5979'
				    	}
					},
					rect = args.rect || {};
			cityList.open({
				rect: {
					x: rect.x || 0,
					y: rect.y || 0,
					w: rect.w || api.frameWidth,
					h: rect.h || api.frameHeight
				},
				resource: args.resource || 'widget://res/cityList.json',
				placeholder: args.placeholder || 'The name of your city',
				styles: args.style || style,
				hotTitle: args.hotTitle || '',
				currentCity: args.currentCity || '',
				fixedOn: args.fixedOn || '',
				locationWay: args.locationWay || ''
			}, function(ret, err){
				switch(ret.eventType){
					case 'show':
						if(typeof args.show === 'function'){
							args.show();
						}
						break;
					case 'selected':
						if(typeof args.selected === 'function'){
							args.selected(ret.cityInfo);
						}
						break;
				}

//				if(ret.eventType === 'selected'){
//					if(typeof callback === 'function'){
//						callback(ret.cityInfo);
//					}
//				}
			});
		},
		transToFr: function(targetResource, resource){
			var fs = api.require('fs'),
				existFile = fs.existSync({
				    path: targetResource
				});

			if(existFile.exist){
				var fileAttr = fs.getAttributeSync({
				    path: targetResource
				}),	ts = new Date('2017-12-10').getTime(),
					modificationDate;	//文件修改日期（时间戳）

				if(!fileAttr.status){
					//获取文件属性失败
					if(api.debug){
					    alert('获取文件属性失败!');
					}
					return;
				}

				modificationDate = fileAttr.attribute.modificationDate;
				modificationDate = modificationDate.length < 13 ? parseInt(modificationDate + '000') : modificationDate;
				if(modificationDate < ts){
					var removeFile = fs.removeSync({
					    path: targetResource
					});
					if (!removeFile.status) {
						//文件删除失败
						if(api.debug){
						    alert('removeFile-' + removeFile.code + ':' + removeFile.msg);
						}
						return;
					}
				}else{
					return targetResource;
				}
			}


			//读取英文省列表文件
			var data = api.readFile({
			    sync: true,
			    path: resource
			});

			data = JSON.parse(data);
			//转换为法语
			data.citys.forEach(function(value, index){
				value.en = value.city;
				value.city = value.fr;
			});

			//创建文件
			var createFile = fs.createFileSync({
			    path: targetResource
			});

			if (!createFile.status) {
				//文件创建失败
				if(api.debug){
					alert('createFile-' + createFile.code + ':' + createFile.msg);
				}
				return;
			}

			//打开刚刚创建的文件
			var openFile = fs.openSync({
			    path: targetResource,
			    flags: 'read_write'
			});
			if (!openFile.status) {
				//文件打开失败
			    if(api.debug){
					alert('openFile-' + openFile.code + ':' + openFile.msg);
				}
			    return;
			}

			//将法文的省列表数据写入新文件
			var writeFile = fs.writeSync({
			    fd: openFile.fd,
			    data: JSON.stringify(data),
			    offset: 0
			});
			if (!writeFile.status) {
				//文件写入失败
			    if(api.debug){
					alert('writeFile-' + writeFile.code + ':' + writeFile.msg);
				}
			    return;
			}

			return targetResource;
		},
		close: function(){
			var cityList = api.require('UICityList');
			cityList.close();
		},
		show: function(){
			var cityList = api.require('UICityList');
			cityList.show();
		},
		hide: function(){
			var cityList = api.require('UICityList');
			cityList.hide();
		}
	};
	window.CityList = cl;
}(window);
