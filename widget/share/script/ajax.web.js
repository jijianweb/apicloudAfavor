

!function(window){
	var ajax = {
		baseUrl: 'http://testafavor.milianjie.com/index.php/Api',
		method: 'get',
		timeout: 30,
		cache: true,
		dataType: 'text',
		showLoading: true,
		data: '',
		get: function(args){
	/**
	* args参数 @param
	* 		ctrl: 请求接口
	*			fn: 接口方法
	* 		url 完整的请求地址，若此参数不为空，则ctrl与fn无效
	*			cache: 是否缓存
	*			timeout: 超时设定
	*			dataType: 数据返回格式
	*			data: 接口方法参数
				string wrapper 模板渲染的父节点，不传则默认"main"
				number loadType 数据加载类型
					默认0：不填该参数，不做任何操作
					1：下拉刷新
					2：上拉加载更多
				boolean hideLoading:是否隐藏"加载中..."占位代码，默认：不隐藏
				showError: 请求失败后(404)，是否显示错误信息
				function success 异步请求成功(200)的回调
				function _404
				function _400
				function error
	**/

			var self = this;
			if(!args.hideLoading){
				var code = ''+
				'<div class="null flex-box" style="z-index: 1;">'+
					'<div class="flex-1">'+
						'加载中...'+
					'</div>'+
				'</div>';
				try{
					if(args.container){
						$api.html($api.dom(args.container), code);
					}else{
						$api.html($api.dom('#main'), code);
					}
				}catch(e){

				}
			}
			if(!args.url){
				args.url = self.baseUrl + '/' + args.ctrl + '/' + args.fn;
			}

			$.ajax({
				type: args.type||'get',
				url: args.url,
				data: (!!args.data.values ? args.data.values:''),
				dataType: 'jsonp',
				timeout: 0,
				cache: args.cache || false,
				success: function(data, status, xhr){
					switch(parseInt(data.status)){
						case 200: /*成功*/
							if('function' === typeof args.success){
								args.success(data.content);
							}
							break;
						case 404: /*服务器拒绝访问*/
							if(args.showError){
								alert(data.msg || '404非法访问:(');
							}
							if(typeof args._404 === 'function'){
								args._404();
							}
							// alert(JSON.stringify(data));
							break;
						case 400: /*权限不足*/
							if(typeof args._400 === 'function'){
								args._400();
							}
							break;
					}
					if(args.loadType){
						switch(args.loadType){
							case 1:
								/*去除下拉刷新样式*/
								//api.refreshHeaderLoadDone();
								break;
							case 2:
								/*scrolltobottom事件, 去除“加载中...”UI*/
								$api.remove($api.dom('.load-more'));
								break;
						}
					}
				},
				error: function(xhr, errorType, error){
					if(args.loadType){
						switch(args.loadType){
							case 1:
								/*去除下拉刷新样式*/
								//api.refreshHeaderLoadDone();
								break;
							case 2:
								/*scrolltobottom事件, 去除“加载中...”UI*/
								$api.remove($api.dom('.load-more'));
								break;
						}
					}
					if('function' === typeof args.error){
						args.error(error);
					}
				}
			});
		}
	};

	window.ajax = ajax;
}(window);
