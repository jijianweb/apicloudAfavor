/*
 * Tool的网页版
 * 
 * 创建于 2015-11-1
 */
!function(window){
	var t = {
		getQueryStringArgs: function(){
				//取得查询字符串并去掉开头的问号
			var qs = (location.search.length > 0 ? location.search.substring(1) : ''),
				//保存数据的对象
					args = {},
				//取得每一项
					items = qs.length ? qs.split('&') : [],
					item = null,
					name = null,
					value = null,
					i = 0,
					len = items.length;
				//逐个将每一项添加到args对象中
				for(i = 0; i < len; i++){
					item = items[i].split('=');
					name = decodeURIComponent(item[0]);
					value = decodeURIComponent(item[1]);
					if(name.length){
						args[name] = value;
					}
				}
			return args;
		},
		hasProp: function(obj){
			/*判断object是否为空*/
			if(typeof obj === 'object' && !(obj instanceof Array)){
				var hasProp = false;
				for(var prop in obj){
					hasProp = true;
					break;
				}
			}
			return hasProp || false;
		},
		removeHTMLTag:function(str){
			//过滤html标签
			str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
			str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
			//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
			str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
			return str;
		},		
		toHTML: function(str){
			//实体转html
			if(str){
				var regx = /&[l,g]t;|&quot;|&nbsp;|&amp;#39;|&amp;/gm,
						_html = str.replace(regx, function(match){
							switch(match){
								case '&amp;#39;':
									return '\'';
								case '&lt;':
									return '<';
								case '&gt;':
									return '>';
								case '&quot;':
									return '"';
								case '&nbsp;':
									return '';
								case '&amp;':
									return '&';
							}
						});
				return _html;
			}else{
				return '';
			}					
		},		
		toEngDate: function(t, type) {
			if(typeof t === 'string') {
				var t = t.replace(/-/g, '/');
				t = new Date(t);
			}
			var strs = t.toString().split(' ', 4);
			if(type == 'MD') {
				return strs[1] + ' ' + strs[2];
			} else if(type == 'YMD') {
				return strs[2] + ' ' + strs[1] + ' ' + strs[3];
			}
		},		
		imageCompressByQiNiu: function(url, model, w, h){
			//七牛图片压缩
			return url + '?imageView2/' + model + '/w/' + w + '/h/' + h;
		},		
		parseDate: function(timestamp){
			/*将时间戳转换为年、月、日、时、分、秒
			 */
			timestamp = timestamp.toString();
			if(timestamp.length == 10){
				/*PHP返回的时间戳长度为10，JS要求的长度必须13
				 * 若长度不足，则以0补充
				 */
				timestamp = parseInt(timestamp) * 1000;
			}
			var _d = new Date(timestamp);
			return {
				year: _d.getFullYear(),
				month: _d.getMonth() + 1,
				date: _d.getDate(),
				hour: _d.getHours(),
				minute: _d.getMinutes(),
				second: _d.getSeconds(),
			};
		}		
	};
	
	window.Tool = t;
}(window);
