/*
 * 针对整个 browse 模块 使用
 */

function openTaskDetail(fid){
	/*
	 * 打开任务详情
	 * @param		{number|string}		fid - 任务id
	 */
	event.stopPropagation();
	api.openWin({
		name: 'task_detail',
		url: api.wgtRootDir + '/html/window/share.html',
		pageParam: {
    	frameName: 'my_task_detail',
			frameUrl: api.wgtRootDir + '/html/my_favors/my_task_detail.html',
			frameParam: {
				favorid: fid
			},
			headerTitle: 'Favor Details',
		},
		allowEdit: false,
		reload: true
  });
}

function getCurrentAddress(callback){
	/*
	 * 通过google JS SDK 根据用户当前所在经纬度获取地址信息(街道+国家)
	 */
	var GoogleMap = api.require('googleMap');
	GoogleMap.getLocation({
		autoStop: true
	}, function(ret){
		if(ret.status){
//var _url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=23.011659113711687,113.73489489789468&key=AIzaSyBo_6AP5aDE4D_SbxcAneGMtYEpgtW1wDw'
			var latlng = ret.lat + ',' + ret.lon;
			console.log("经纬度:-----" + latlng);
			api.ajax({
//				url: _url,
				url: 'https://maps.googleapis.com/maps/api/geocode/json',
				data: {
					values: {
						latlng: latlng,
						language: 'en',
						result_type: 'street_address',
						location_type: 'ROOFTOP',
						key: CONFIG.GOOGLE.KEY
					}
				}
			}, function(ret, err){
				if(ret && ret.results.length > 0){
					console.log('Google JS-SDK:------' + JSON.stringify(ret));
					//
					var result = ret.results[0],
							//详细地址
							formatted_address = result.formatted_address,
							country, street;
					//转换为数组
					formatted_address = formatted_address.split(', ');
					country = formatted_address[formatted_address.length - 2];
					street = formatted_address[0];

					if(typeof callback == 'function'){
						callback(street + ', ' + country);
					}
				}else{
					console.log('Google JS-SDK:------' + JSON.stringify(ret));
				}
				
			});
//			alert(JSON.stringify(ret));
		}
	});	
	
	
}
