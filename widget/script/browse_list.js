
function fixTitle(DOMs){
	var titleContent,
		titleDom,
		titleDomWidth,
		priceBoxDom,
		priceBoxDomOffset;
	[].forEach.call(DOMs, function(dom, index){
		priceBoxDom = $api.dom(dom, '.price_box');
		priceBoxDomOffset = $api.offset(priceBoxDom);
		titleDom = $api.dom(dom, '.title');
		titleDomWidth = api.frameWidth - 116 - priceBoxDomOffset.w;
		$api.css(titleDom, 'width:' + titleDomWidth + 'px');
		titleContent = $api.attr(titleDom, 'data-content');
		$api.text(titleDom, titleContent);
	});
}
//附近任务列表
function TaskList(type, args){
	/*
	 * @param	{number}	type - 场景类型，1：用户切换城市；空值:定位用户当前位置
	 * @param	{object}	args - type为1时，切换的城市信息
	 */
	ajax.get({
		ctrl: 'Browse',
		fn: 'getNearList',
		data: {
			values: values
		},
		success: function(ct) {
			//替换default_currency
			default_currency = ct.default_currency;
			T.html('#main', 'main', ct.list);
//			fixTitle($api.domAll('.list-item'));
			L.init();
			switch(type){
				case 1:	//用户切换城市
					//更新顶部地址信息
					api.sendEvent({
						name: 'setAddress',
						extra: {
							type: 1,
							location: args,
							favorTotal: ct.total || 0,
						}
					});	
					break;
				default:	//定位用户当前位置
					getCurrentAddress(function(address){
						api.sendEvent({
							name: 'setAddress',
							extra: {
								address: address,
								favorTotal: ct.total || 0,
								distance: values.distance2
							}
						});
					});
					break;
			}

//					api.sendEvent({
//						name: 'brotitle',
//						extra:ct
//					})
//					if(typeof callback == 'function') {
//						callback();
//					}
		}
	});
}

//点击收藏
function collect(_this, event, fid){
	event.stopPropagation();
	var fn = '';
	if($api.hasCls(_this,'no_collect')){
		fn = 'addCollection';
		$api.addCls(_this,'collect');
		$api.removeCls(_this,'no_collect');
	}else{
		fn = 'delCollection';
		$api.addCls(_this,'no_collect');
		$api.removeCls(_this,'collect');
	}
	ajax.get({
		ctrl: 'Browse',
		fn: fn,
		data: {
			values: {
				id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
				token: $api.getStorage(CONFIG.KEY.TOKEN),
				type: 1,
				favorid: fid
			}
		},
		hideLoading: true,
		showError: true,
		success: function(ct) {
			if(fn == 'addCollection'){
				Tool.toast('Add to Favorites.');
			}else{
				Tool.toast('Remove from Favorites.');
			}
		}
	});
}
