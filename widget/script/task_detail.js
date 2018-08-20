

function makePayment(favorId, money, workers){
	/*
	 * 发布者支付任务费用
	 * @param	{number}	favorId	任务id
	 * @param	{float}		money		任务价格
	 */
	
	
	
	api.openWin({
		name: "Make_A_Payment",
		url: api.wgtRootDir + '/html/window/post/make_a_payment.html',
		pageParam: {
			favorId: favorId,
			money: money,
			workers: workers	//任务需要的帮助者人数，支付后用于加入群聊
		}
	});
	
}

function deleteFavor(favorid){
	api.confirm({
		msg: 'Are you sure to delete this favor ?',
		buttons: ['NO', "YES"]
	}, function(ret, err){
		if(ret.buttonIndex == 2){
			ajax.get({
				ctrl: 'Favor',
				fn: 'delFavor',
				data: {
					values: {
						id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
						token: $api.getStorage(CONFIG.KEY.TOKEN),
						favorid: favorid
					}
				},
				showError: true,
				showProgress: true,
				hideLoading: true,
				success: function() {
					api.execScript({
						name: 'Init',
						frameName: 'more',
						script: 'init()'
					});
					api.execScript({
						name: 'Init',
						frameName: 'help_person',
						script: 'init()'
					});
					
					Tool.toast("Delete successfully");
						setTimeout(function(){
							api.closeToWin({
								name: 'Init'
						});
					}, 300);
				}
			});				
		}
	});
}
