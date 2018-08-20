//附近任务列表
function TaskList(){
	var GoogleMap = api.require('googleMap');

	ajax.get({
		ctrl: 'Browse',
		fn: 'getNearList',
		data: {
			values: values
		},
		hideLoading: true,
		showProgress: false,
		success: function(ct) {

//console.log('大头针--------： ' + JSON.stringify(ct.list))
			if(ct.list instanceof Array && ct.list.length != 0){
				var annotationsData = getAnnotationsData(ct.list);

console.log('大头针--------： ' + JSON.stringify(annotationsData));

				//在地图上添加大头针
				GoogleMap.addAnnotations({
				    annotations: annotationsData,
				    icons: [iosMapIcon],		//ios
				    icon: androidMapIcon			//android
				});
				
				
				//监听大头针点击事件
				GoogleMap.addAnnotationListener(function(ret) {
				    if (ret.eventType == 'click') {
				    	if(activeMapIconId){
							GoogleMap.setAnnotationIcon({
							    id: activeMapIconId,
						       	icon : api.systemType == 'android' ? androidMapIcon : iosMapIcon
							});				    		
				    	}
				    	
				    	activeMapIconId = ret.id;
				    	
						GoogleMap.setAnnotationIcon({
						    id: activeMapIconId,
					       	icon : api.systemType == 'android' ? androidMapIconActive : iosMapIconActive
						});					    	
				    	
						api.openFrame({
							name: 'map_bubble',
							bounces: false,
						 	rect: {
						 		x: 0,
						 		y: api.winHeight - 160,
						 		w: 'auto',
						 		h: 110
						 	},
							pageParam: {
								fid: ret.id
							},
							reload: true,
							url: api.wgtRootDir + '/html/browse/bubble_frame.html'
						});
				    }
				});
			}

			//设置头部地理位置信息
//			api.sendEvent({
//				name: 'brotitle',
//				extra: ct
//			});
		}
	});
}

function getAnnotationsData(list){
	/*
	 * 整理接口返回的数据，用于大头针数据显示
	 */
	var _arr = [];

	list.forEach(function(value, index){
		_arr.push({
			id: value.id,
			lon: value.x,
			lat: value.y
		})
	});
	return _arr;
}

function getCoordsFromName(args){
	/*
	 * 根据地址查找经纬度
	 * @param	{string}	address - 地址信息
	 */

	api.ajax({
	    url: 'https://maps.googleapis.com/maps/api/geocode/json',
	    method: 'get',
	    data: {
	        values: {
	            key: CONFIG.GOOGLE.KEY,
	            address: args.address,
	        },
	    }
	}, function(ret, err) {
	    if (ret && ret.results) {
	    	console.log('根据地址查找经纬度: ---' + JSON.stringify(ret, null, 2))
	    	if(ret.results.length == 0){
	    		alert('error address');
//	    		Tool.toast('error address');
	    		return;
	    	}
	    	var value = ret.results[0];
	    	var add = value.formatted_address;
	    	$api.setStorage('cityinfo',value)
	    	if(value.geometry){
	    		if(value.geometry.location){
					if(typeof args.success == 'function'){
						args.success(value.geometry.location);
					}
	    		}
	    	}
	    }else{
	    	console.log('Google JS-SDK 运行失败')
	    }
	});
}


function getAddressList(args){
	/*
	 * 根据用户输入地址模糊匹配所有地址
	 * @param	{string}	address - 地址信息
	 */

	api.ajax({
	    url: 'https://maps.googleapis.com/maps/api/geocode/json',
	    method: 'get',
	    data: {
	        values: {
	            key: CONFIG.GOOGLE.KEY,
	            address: args.address,
	        },
	    }
	}, function(ret, err) {
	    if (ret && ret.results) {
	    	console.log('根据地址查找经纬度getAddressList: ---' + JSON.stringify(ret, null, 2))
	    	if(ret.results.length == 0){
	    		api.hideProgress();
	    		Tool.toast('error address');
//	    		Tool.toast('error address');
	    		return;
	    	}

			if(typeof args.success == 'function'){
				args.success(ret.results);
			}
	    }else{
	    	console.log('Google JS-SDK 运行失败')
	    }
	});
}
