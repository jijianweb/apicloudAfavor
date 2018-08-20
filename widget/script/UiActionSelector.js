/*
 * UIActionSelector 是一个支持弹出动画的多级选择器。调用 open 接口，会从当前 window 底部弹出一个 action 选择器，
 * 该选择器在 iOS 平台上是立体滚轮效果的，在 android 平台上二维平面效果的。开发者可自定义该选择器的数据源，
 * 利用此模块做出一个城市地区选择器、公司部门选择器，菜单选择器等各种炫酷的选择器。
 */
!function(window){
	var cl = {
		open: function(args, callback){
			/*打开模块
			 * 	datas：为选择器指定数据，可以是 JSON 数组 或是以 JSON 数组格式内容保存的文件的fs://、widget://路径，若为 json 文件则必须是标准的 json格式，否则会报错。
			 * 	layout 选择器的布局设置
			 * 				{
							    row: 5,                            //（可选项）数字类型；每屏显示的数据行数，超出的数据可以滑动查看，只能是奇数；默认：5
							    col: 3,                            //（可选项）数字类型；数据源的数据级数，最多3级；默认：3
							    height: 30,                        //（可选项）数字类型；每行选项的高度；默认：30
							    size: 12,                          //（可选项）数字类型；普通选项的字体大小；默认：12
							    sizeActive: 14,                    //（可选项）数字类型；当前选项的字体大小；默认：同 size
							    rowSpacing: 5,                     //（可选项）数字类型；行与行之间的距离；默认：5
							    colSpacing: 10,                    //（可选项）数字类型；列与列之间的距离；默认：10
							    maskBg: 'rgba(0,0,0,0.2)',         //（可选项）字符串类型；遮罩层背景，点击该区域隐藏选择器，支持 rgb，rgba，#，img；默认：rgba(0,0,0,0.2)
							    bg: '#fff',                        //（可选项）字符串类型；选择器有效区域背景，支持 rgb，rgba，#，img；默认：#fff
							    color: '#888',                     //（可选项）字符串类型；选项的文字颜色，支持 rgb，rgba，#；默认：#848484
							    colorSelected: '#f00'              //（可选项）字符串类型；已选项的文字颜色，支持 rgb，rgba，#；默认：同 colorActive
							}
			 *	animation	弹出和隐藏选择器时是否带弹出动画效果 
			 * 				默认：true
			 *  cancel		取消按钮设置，取消按钮显示在选择器左上角
			 * 				内部字段：
							{                                      //（可选项）JSON 对象类型；取消按钮设置
							    text: '取消',                      //（可选项）字符串类型；取消按钮的显示文字；默认：未设置时只显示背景
							    size: 12,                          //（可选项）数字类型；取消按钮的显示文字大小；默认：12
							    w: 90,                             //（可选项）数字类型；取消按钮的宽；默认：90
							    h: 35,                             //（可选项）数字类型；取消按钮的高；默认：35
							    bg: '#fff',                        //（可选项）字符串类型；取消按钮的背景，支持 rgb，rgba，#，img；默认：'#fff'
							    bgActive: '#ccc',                  //（可选项）字符串类型；取消按钮的背景高亮，支持 rgb，rgba，#，img；默认：同 bg
							    color: '#888',                     //（可选项）字符串类型；取消按钮的文字颜色，支持 rgb，rgba，#；默认：'#848484'
							    colorActive: '#fff'                //（可选项）字符串类型；取消按钮的文字颜色高亮，支持 rgb，rgba，#；默认：同 color
							}
			 *	ok：
							类型：JSON 类型
							描述：确定按钮设置，确定按钮显示在选择器右上角
							内部字段：
							{                                      //（可选项）JSON 对象类型；确定按钮设置
							    text: '确定',                      //（可选项）字符串类型；确定按钮的显示文字；默认：未设置时只显示背景
							    size: 12,                          //（可选项）数字类型；确定按钮的显示文字大小；默认：12
							    w: 90,                             //（可选项）数字类型；确定按钮的宽；默认：90
							    h: 35,                             //（可选项）数字类型；确定按钮的高；默认：35
							    bg: '#fff',                        //（可选项）字符串类型；确定按钮的背景，支持 rgb，rgba，#，img；默认：'#fff'
							    bgActive: '#ccc',                  //（可选项）字符串类型；确定按钮的背景高亮，支持 rgb，rgba，#，img；默认：同 bg
							    color: '#888',                     //（可选项）字符串类型；确定按钮的文字颜色，支持 rgb，rgba，#；默认：'#848484'
							    colorActive: '#fff'                //（可选项）字符串类型；确定按钮的文字颜色高亮，支持 rgb，rgba，#；默认：同 color
							}
			 *	title：
							类型：JSON 类型
							描述：选择器顶部标题栏设置
							内部字段：
							{                                      //（可选项）JSON 对象类型；选择器顶部标题栏设置
							    text: '请选择',                    //（可选项）字符串类型；选择器的标题内容；默认：请选择
							    size: 12,                          //（可选项）数字类型；标题内容的文字大小；默认：12
							    h: 44,                             //（可选项）数字类型；标题栏的高；默认：44
							    bg: '#eee',                        //（可选项）字符串类型；标题栏的背景，支持 rgb，rgba，#，img；默认：'#eee'
							    color: '#888'                      //（可选项）字符串类型；标题内容的文字颜色，支持 rgb，rgba，#；默认：'#848484'
							}
			 * 	cactives：
							类型：数组
							描述：打开模块时默认选项下标组成的数组，如：[0,0,0]
							默认：各级选项的首项的索引组成的数组
			 *	fixedOn：
							类型：字符串类型
							描述：（可选项）模块视图添加到指定 frame 的名字（只指 frame，传 window 无效）
							默认：模块依附于当前 window
			 * 
			 * success: 	选中回调
			 * cancelCb:	取消选择回调
			 * @return 
							 {
							    eventType: 'ok',                  //字符串类型；交互事件类型，取值范围如下：
							                                      //ok（表示用户点击了确定按钮）
							                                      //cancel（表示用户取消了选择器显示，包括点击取消按钮和遮罩层）
							    level1: '河南省',                  //字符串类型；第一级选项的内容；只在 eventType 是 ok 时有效
							    level2: '驻马店市',                //字符串类型；第二级选项的内容；只在 eventType 是 ok 时有效
							    level3: '泌阳县',                  //字符串类型；第三级选项的内容；只在 eventType 是 ok 时有效
							    selectedInfo: [                   //JSON对象；选中项的详细信息（open时传入的信息）
							        {
							            name:'河南省',  
							            id:'',                     // 字符串类型；第一级选项的内容；该字段为用户定义字段
							            title:'',                  // 字符串类型；第一级选项的内容；该字段为用户定义字段
							            ...
							        },
							        {
							            name:'驻马店市',
							            id:'',
							            title:'',
							            ...
							        },
							        {
							            name:'泌阳县',
							            id:'',
							            title:'',
							            ...
							        }
							    ]                
							}
			 */
			
			var layout = {
		        row: 5,
		        col: 3,
		        height: 30,
		        size: 12,
		        sizeActive: 14,
		        rowSpacing: 5,
		        colSpacing: 10,
		        maskBg: 'rgba(0,0,0,0.2)',
		        bg: '#fff',
		        color: '#888',
		        colorActive: 'rgba(50,187,177,0.6)',
		        colorSelected: '#32BBB1'
		    };
			var UIActionSelector = api.require('UIActionSelector'),
				language = $api.getStorage('language'),
				dataFile;
			
			if(language == 1){
				//英语
				dataFile = 'widget://res/area.json';
			}else{
				//法语
				dataFile = 'widget://res/area_fr.json';
			}
				
			UIActionSelector.open({
				datas: 'widget://res/area.json',
//			    datas: dataFile ? dataFile : 'widget://res/area.json',
			    layout: args.layout ? args.layout : layout,
			    animation: true,
			    cancel: args.cancel ? args.cancel : {
			        text: 'Cancel',
			        size: 12,
			        w: 90,
			        h: 35,
			        bg: '#fff',
			        bgActive: '#ccc',
			        color: '#888',
			        colorActive: '#fff'
			   },
			    ok: args.ok ? args.ok : {
			        text: 'Ok',
			        size: 12,
			        w: 90,
			        h: 35,
			        bg: '#32BBB1',
			        bgActive: 'rgba(50,187,177,0.6)',
			        color: '#fff',
			        colorActive: '#fff'
			    },
			    title: args.title ? args.title : {
			        text: ' ',
			        size: 12,
			        h: 44,
			        bg: '#eee',
			        color: '#888'
			    },
			    actives: args.actives ? args.actives : [0,0,0],
			    fixedOn: api.frameName
			}, function(ret, err) {
			    if (ret) {
			    	if(ret.eventType == 'ok'){
			       		typeof args.success === "function" && args.success(ret);
				    } else {
				        typeof args.cancelCb === "function" && args.cancelCb(ret);
				    }
			    } else {
			    }
			});
		},
		close: function(){
			var UIActionSelector = api.require('UIActionSelector');
			UIActionSelector.close();
		},
		show: function(){
			var UIActionSelector = api.require('UIActionSelector');
			UIActionSelector.show();
		},
		hide: function(){
			var UIActionSelector = api.require('UIActionSelector');
			UIActionSelector.hide();
		},
		setActive: function(actives){
			/*
			 actives：
				类型：数组
				描述：打开模块时默认选项下标组成的数组，如：[0,0,0]
			 * */
			var UIActionSelector = api.require('UIActionSelector');
			UIActionSelector.setActive({
			    actives: actives
			});
		},
		transToFr3: function(){
			var fs = api.require('fs'),
				areaFile = 'widget://res/area_backup.json';
				
			var areaData = api.readFile({
				sync: true,
				path: areaFile
			});
			
			areaData = JSON.parse(areaData);
			
			Area.data.forEach(function(country, countryIndex){
				country.children.forEach(function(province, provinceIndex){
					province.fr = areaData[countryIndex].sub[provinceIndex].fr;
					
					province.children.forEach(function(city, cityIndex){
						city.fr = areaData[countryIndex].sub[provinceIndex].sub[cityIndex].fr;
					});
				});
			});
			
			//创建文件
			var targetResource = 'fs://UIActionSelector/area_fr_' + new Date().getTime() + '.json';
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
			    data: JSON.stringify(Area.data),
			    offset: 0
			});
			if (!writeFile.status) {
				//文件写入失败
			    if(api.debug){
					alert('writeFile-' + writeFile.code + ':' + writeFile.msg);
				}
			    return;
			}	
			
			alert('转换写入完成');			
			
		},
		transToFr2: function(){
			var fs = api.require('fs'),
				areaFile = 'widget://res/area_2.json';
				
			var areaData = api.readFile({
				sync: true,
				path: areaFile
			});
			
			areaData = JSON.parse(areaData);
			
			areaData.forEach(function(country, countryIndex){
				country.sub.forEach(function(province, provinceIndex){
					province.name = province.fr;
					
					province.sub.forEach(function(city, cityIndex){
						city.name = city.fr;
					});
				});
			});
			
			//创建文件
			var targetResource = 'fs://UIActionSelector/area_fr_' + new Date().getTime() + '.json';
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
			    data: JSON.stringify(areaData),
			    offset: 0
			});
			if (!writeFile.status) {
				//文件写入失败
			    if(api.debug){
					alert('writeFile-' + writeFile.code + ':' + writeFile.msg);
				}
			    return;
			}	
			
			alert('法语写入完成');
		},
		transToFr: function(){
			var fs = api.require('fs'),
				areaFile = 'widget://res/area.json';
			
			var areaData = api.readFile({
				sync: true,
				path: areaFile
			});
			
			areaData = JSON.parse(areaData);
			//转换为法语
			var provinceFile,
				provinceData,
				provinceName,
				cityFile,
				cityData;
			areaData.forEach(function(country, countryIndex){
				if(country.name == 'America'){
					provinceFile = 'widget://res/usa_province.json';
				}else{
					provinceFile = 'widget://res/canada_province.json';
				}
				
				provinceData = api.readFile({
					sync: true,
					path: provinceFile
				});
				
				provinceData = JSON.parse(provinceData);
				
				country.sub.forEach(function(province, provinceIndex){
					province.fr = provinceData.citys[provinceIndex].fr;
					
					provinceName = $api.trimAll(province.name);
					
					if(country.name == 'America'){
						cityFile = 'widget://res/usa_citys_lists/' + provinceName + '.json';
					}else{
						cityFile = 'widget://res/canda_citys_lists/' + provinceName + '.json';
					}
					
					cityData = api.readFile({
						sync: true,
						path: cityFile
					});
					
					try{
						cityData = JSON.parse(cityData);
					}catch(e){
						alert(province.name)
					}
					
					
					province.sub.forEach(function(city, cityIndex){
						city.fr = cityData.citys[cityIndex].fr;
					});
				});
			});
			
			//创建文件
			var targetResource = 'fs://UIActionSelector/area_' + new Date().getTime() + '.json';
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
			    data: JSON.stringify(areaData),
			    offset: 0
			});
			if (!writeFile.status) {
				//文件写入失败
			    if(api.debug){
					alert('writeFile-' + writeFile.code + ':' + writeFile.msg);
				}
			    return;
			}
			
			alert('写入完成')
		},
		getActive: function(args){
			var UIActionSelector = api.require('UIActionSelector');
			UIActionSelector.getActive(function(ret, err) {
			    if (ret) {
			        typeof args.success === "function" && args.success(ret);
			    } else {
			        typeof args.error === "function" && args.error(err);
			    }
			});
		}
	};
	window.UIActionSelector = cl;
}(window);
