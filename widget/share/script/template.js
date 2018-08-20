/*
 * 模板拼接，必须先导入doT.js
 * 创建于2016-1-10
 */
!function(window){
	var t = {
		html: function(selector, template, data){
			$api.html($api.dom(selector), doT.template($api.html($api.dom('[template="'+template+'"]')))(data||''));
			try{
				api.parseTapmode();
			}catch(e){
				
			}
		},
		append: function(selector, template, data){
			$api.append($api.dom(selector), doT.template($api.html($api.dom('[template="'+template+'"]')))(data||''));
			try{
				api.parseTapmode();
			}catch(e){
				
			}
		},
		prepend: function(selector, template, data){
			$api.prepend($api.dom(selector), doT.template($api.html($api.dom('[template="'+template+'"]')))(data||''));
			try{
				api.parseTapmode();
			}catch(e){
				
			}
		}
	};
	window.T = t;
}(window);
