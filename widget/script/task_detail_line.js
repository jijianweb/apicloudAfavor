function sortToOffers(ct){
	/*
	 * 数据整理
	 * 针对返回的帮助者列表数据进行排序
	 */
	var _offers = [],	//重新排序后的报名列表
			_obj = {},	//每一行的数据
			_temp = [],
			assignedNum = 0,	//已入围申请帮助者数
			singleOffers = [];	//单人报名

	if(!(ct.offers instanceof Array) || ct.offers.length == 0){
		return;
	}

	var	arr = ct.offers.sort(function(a, b){
				return -(a.length - b.length);
			});

	arr.forEach(function(value, index){
		if(value.length >= 2){
			//数组长度大于即会触发连线
			_obj.group = value;
			_obj.line = true;
			_obj.isself = ct.isself;
			_offers.push(_obj);
			if(value[0].status == 2){
				//已入围的帮助者
				assignedNum += value.length;
			}
		}else{
			//单人报名
			singleOffers.push(value[0]);
			if(value[0].status == 2){
				//已入围的帮助者
				assignedNum += 1;
			}
		}
		_obj = {};
	});

	//针对单人报名的数据进行整理
	singleOffers.forEach(function(value, index, ar){
		_temp.push(value);
		if(_temp.length == 3 || !ar[index + 1]){
			_obj = {};
			_obj.group = _temp;
			_obj.isself = ct.isself;
			_offers.push(_obj);
			_temp = [];	//重置
		}
	});

	//给每行数据添加 是否满人的识别符
	if(assignedNum == parseInt(ct.workers)){
		_offers.forEach(function(value, index){
			value.isFull = true;	//已满人，不能再接受帮助者的申请
		});
	}

//	alert('已报名人数：' + assignedNum);
	console.log('已报名的数据整理：' + JSON.stringify(_offers, null, 2));
	return _offers;
}

function sortToOngoingby(ct){
	/*
	 * 数据整理
	 * 针对返回的参与任务的帮助者列表数据进行排序
	 */
	var _offers = [],	//重新排序后的报名列表
			_obj = {},	//每一行的数据
			_temp = [],
			singleOffers = [];	//单人报名

	if(!(ct.ongoingby instanceof Array) || ct.ongoingby.length == 0){
		return;
	}

	var	arr = ct.ongoingby.sort(function(a, b){
				return -(a.length - b.length);
			});

	arr.forEach(function(value, index){
		if(value.length >= 2){
			//数组长度大于即会触发连线
			_obj.group = value;
			_obj.ongoing = true;
			_obj.line = true;
			_obj.isself = ct.isself;
			_offers.push(_obj);
		}else{
			//单人报名
			singleOffers.push(value[0]);
		}
		_obj = {};
	});

	//针对单人报名的数据进行整理
	singleOffers.forEach(function(value, index, ar){
		_temp.push(value);
		if(_temp.length == 3 || !ar[index + 1]){
			_obj = {};
			_obj.group = _temp;
			_obj.ongoing = true;
			_obj.isself = ct.isself;
			_offers.push(_obj);
			_temp = [];	//重置
		}
	});

	console.log('参与任务的帮助者：' + JSON.stringify(_offers, null, 2));
	return _offers;
}

function initHelperListForLine(ct){

	var _offers = sortToOffers(ct),		//对返回的帮助者数组数据进行排序
			swiperWrapperDom = $('.swiper-wrapper'),
			swiperPageDom,
			swiperRowDom1, swiperRowDom2;

	if(!(_offers instanceof Array) || _offers.length == 0){
		return;
	}

	_offers.forEach(function(value, index, arr){
		if(index % 2 == 0){
			//整理一页排版
			swiperPageDom = $(createSwiperPageDom());

			//整合页面的第一行数据
			swiperRowDom1 = $(createSwiperRowDom());
			swiperRowDom1.html(makeTemplate('swiper-row', value));
			swiperPageDom.append(swiperRowDom1);

			if(arr[index+1]){
				//整合页面的第二行数据
				swiperRowDom2 = $(createSwiperRowDom());
				swiperRowDom2.html(makeTemplate('swiper-row', arr[index+1]));
				swiperPageDom.append(swiperRowDom2);
			}

			swiperWrapperDom.append(swiperPageDom);
		}
	});

//			initSwiper();
}

function initOngoingByListForLine(ct){
	var ongoingBy = sortToOngoingby(ct),		//对返回的帮助者数组数据进行排序
			wrapperDom = $('#ongoing-by .page'),
			rowDom;

	if(!(ongoingBy instanceof Array) || ongoingBy.length == 0){
		return;
	}

	ongoingBy.forEach(function(value, index, arr){
		//整理一页排版

		//整合页面的第一行数据
		rowDom = $(createSwiperRowDom());
		rowDom.html(makeTemplate('swiper-row', value));
		wrapperDom.append(rowDom);
	});	
}

function createSwiperPageDom(){
	return '<div class="swiper-slide swiper-page"></div>';
}

function createSwiperRowDom(){
	return '<div class="swiper-row"></div>';
}

function makeTemplate(template, data){
	var _html = doT.template($api.html($api.dom('[template="' + template + '"]')))(data || '');

	return _html;
}

function isFull(_this){
	/*
	 * 判断是否报名满额
	 */

	var workers = $api.trim($api.text($api.dom('#worker-num'))),	//任务最多可报名人数
			acceptBtnDoms = $api.domAll('.swiper-accept-btn.cancel'),
			acceptNum = parseInt($api.attr(_this, 'helper-num')),	//发布者将要接受报名的人数
			assignedNum = 0;	//记录已报名的人数

	workers = parseInt(workers);

	[].forEach.call(acceptBtnDoms, function(dom, index){
		assignedNum += parseInt($api.attr(dom, 'helper-num'));
	});

	if(workers - assignedNum < acceptNum){
		return true;
	}else{
		return false;
	}
}

function dealOffer(_this, event){
	/*
	 * 发布者操作前确定
	 */
	event.stopPropagation();
	
	var dealStatus = $api.attr(_this, 'deal-status'),
		isGroup = $api.attr(_this, 'group'),
		memberNames = '',	//帮助者名字(包括组队与非组队的)
		_dom,
		groupMemberDoms,
		status;	//将要处理的操作
		
	if(isGroup == 'true'){
		//组队
		_dom = $api.closest(_this, '.swiper-row');
		groupMemberDoms = $api.domAll(_dom, '[helper-name]');
		[].forEach.call(groupMemberDoms, function(dom, index, arr){
			memberNames += $api.attr(dom, 'helper-name');
			if(index < arr.length - 1){
				memberNames += ', ';
			}
		});
	}else{
		//非组队
		_dom = $api.closest(_this, '[helper-name]');
		memberNames = $api.attr(_dom, 'helper-name');
	}		
	
	
	switch(dealStatus){
		case "1":	//帮助者处于申请中状态，发布者同意申请
			//判断是否满人
			if(isFull(_this)){
				Tool.toast('Fulfil the quota!');
				return;
			}
			msg = 'Accept ' + memberNames + ' Offer ?';
			break;
		case "2":	//帮助者的申请被发布者接受，发布者可拒绝
			msg = 'Cancel ' + memberNames + ' Offer ?';
			break;
	}		
	
	api.confirm({
		msg: msg,
		buttons: ['NO', 'YES']
	}, function(ret){
		if(ret.buttonIndex == 2){
			dealHelperOffers(_this, event);
		}
	});
}

function dealHelperOffers(_this, event){
	/*
	 * 发布者处理工作申请
	 */
	
	event.stopPropagation();

	var dealStatus = $api.attr(_this, 'deal-status'),
		isGroup = $api.attr(_this, 'group'),
		memberIds = '',
		_dom,
		groupMemberDoms,
		status;	//将要处理的操作



	switch(dealStatus){
		case "1":	//帮助者处于申请中状态，发布者同意申请
			status = 2;
			//判断是否满人
			if(isFull(_this)){
				Tool.toast('Fulfil the quota!');
				return;
			}
			break;
		case "2":	//帮助者的申请被发布者接受，发布者可拒绝
			status = 1;
			break;
	}

	if(isGroup == 'true'){
		//组队
		_dom = $api.closest(_this, '.swiper-row');
		groupMemberDoms = $api.domAll(_dom, '[helper-id]');
		[].forEach.call(groupMemberDoms, function(dom, index, arr){
			memberIds += $api.attr(dom, 'helper-id');
			if(index < arr.length - 1){
				memberIds += ',';
			}
		});
	}else{
		//非组队
		_dom = $api.closest(_this, '[helper-id]');
		memberIds = $api.attr(_dom, 'helper-id');
	}

	ajax.get({
		ctrl: 'Favor',
		fn: 'dealOffer',
		hideLoading: true,
		showProgress: true,
		_404: function(ct){
//			alert(JSON.stringify(ct))
		},
		data: {
			values: {
				id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
				token: $api.getStorage(CONFIG.KEY.TOKEN),
				status: status,		//处理状态,1:取消,2:同意,3:拒绝,4:确认完成
				memberids: memberIds,
				favorid: api.pageParam.favorid
			}
		},
		success: function(ct){
			switch(status){
				case 1:	//按钮变成 Accept Offer 状态
					$api.removeCls(_this, 'cancel');
					$api.text($api.dom(_this, 'span'), LANGUAGE[$api.getStorage('lan')]['AcceptOffer']);
					break;
				case 2:	//发布者可拒绝，按钮变成 Assigned 状态
					$api.addCls(_this, 'cancel');
					$api.text($api.dom(_this, 'span'), LANGUAGE[$api.getStorage('lan')]['Assigned']);
					break;
			}
			updateAcceptBtn(_this);//刷新 Accept 按钮
			$api.attr(_this, 'deal-status', status);
		}
	});
//	alert(dealStatus);
}

function updateAcceptBtn(_this){
	/*
	 * 发布者同意某些申请者后，刷新所有按钮状态
	 */

  var acceptBtnDoms = $api.domAll('.swiper-accept-btn:not(.cancel)'),
		 	assignedBtnDoms = $api.domAll('.swiper-accept-btn.cancel'),
			workerNum = parseInt($api.trim($api.text($api.dom('#worker-num')))),	//该任务需要的总人数
			hasNum = 0,	//已报名人数
			resumeNum, //剩余可报名人数
			helperNum;

	[].forEach.call(assignedBtnDoms, function(dom, index){
		helperNum = parseInt($api.attr(dom, 'helper-num'));
		hasNum += helperNum;
	});

	resumeNum = workerNum - hasNum;

	[].forEach.call(acceptBtnDoms, function(dom, index){
		helperNum = parseInt($api.attr(dom, 'helper-num'));
		if(helperNum > resumeNum){
			$api.attr(dom, 'disabled', 'disabled');
		}else{
			$api.removeAttr(dom, 'disabled');
		}
	});
}

//针对线下任务，打开goolgle小地图
function openSmallMap(location) {
	var GoogleMap = api.require('googleMap');
	var rect = $api.offset($api.dom('.map'));
	rect = {
		x: rect.l,
		y: rect.t,
		w: rect.w,
		h: rect.h
	};
	
	GoogleMap.close();
	
	GoogleMap.open({
		rect: rect,
		showUserLocation: false,
		zoomLevel: 10,
		center: {
			lon: location.x,
			lat: location.y
			//			        lon: 116.233,
			//  				lat: 39.134,
		},
		fixedOn: api.frameName,
		fixed: false
	}, function(ret) {
		if(ret.status) {
			GoogleMap.addAnnotations({
				annotations: [{
					id: 1,
					lon: location.x,
					lat: location.y
				}],
				icons: ['widget://image/browse/map_icon.png'],	//ios
				icon: 'widget://image/browse/didian.png'		//android
			});
			
			GoogleMap.addEventListener({
			    name: 'viewChange'
			}, function(ret) {
			    if (ret.status) {
			    	var maxZoom = 13;
//						    	Tool.toast(ret.zoom);
			    	if(ret.zoom > maxZoom){
						GoogleMap.setZoomLevel({
							animation: false,
						    level: maxZoom
						});						    		
			    	}
			    }
			});				
		}
	});
}
