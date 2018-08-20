/*
 * 针对任务聊天板块功能，补充
 */

RongCloud2.getMessageByFavorId = function(args){
	/*
	 * 根据任务id筛选出对应的消息
	 * @param	{number}	favorId - 任务id
	 * @param	{array}		message	- 历史消息 
	 */
	
	var arr = [],
		extra;
	
	args.message.forEach(function(value, index){
		extra = JSON.parse(value.content.extra);
		if(extra.favorid == args.favorId){
			arr.push(value);
		}
	});
	
	return arr;
};

RongCloud2.mesgIsFromCurrentConversation = function(args){
	/*
	 * 收到新消息的时候，根据当前聊天会话的任务id判断是否渲染该消息
	 * @param	{number}	favorId - 任务id
	 * @param	{object}	message	- 历史消息 
	 */
	
	var	extra = JSON.parse(args.message.content.extra),
		tip,
		messageFavorId = extra.favorid;
	
	if(args.favorId == messageFavorId){
		return true;
	}else{
		tip = 'You have a new message about "' + extra.taskTitle + '"';
//		Tool.toast(tip);
		return false;
	}
};

RongCloud2.closeChatEntrance = function(){

	api.addEventListener({
		name: 'closeChatEntrance'
	}, function(ret, err){
		/*
		 * 监听 任务完成时，删除聊天入口
		 * @param	{number}	favorId - 任务id
		 */
		
		var favorId = ret.value.favorId;
		
		//获取会话列表
		RongCloud2.getConversationList(function(result){
			console.log('inbox列表：---------' + JSON.stringify(result,null,2));
			
			var	_dom,
				jsonData, 
				inboxtype,	//区分单聊(2)、群聊(1)
				targetId,
				extra;	
				
			result.some(function(value,index){
				extra = JSON.parse(value.latestMessage.extra);
				
				if(extra.favorid == favorId){
					inboxtype = extra.inboxtype;
					targetId = value.targetId;
					//删除对应的任务会话
					RongCloud2.removeConversation({
						conversationType: inboxtype == 2 ? 'PRIVATE' : 'GROUP',
						targetId: targetId,
						success: function(){
							//刷新未读消息红点
							api.execScript({
								name: 'Init',
								script: 'setBadge()'
							});
							
							if(api.frameName == 'inbox'){
								_dom = $api.dom('.list-view[favorid="' + favorId + '"]');
								if(_dom){
									$api.remove(_dom);
								}
							}
						}
					});	
					
					return true;	//停止遍历
				}
			});

		});		
	});
};

RongCloud2.joinChat = function(args){
	/*
	 * 收到发布者任务支付推送，若是多人任务，即需要加入群聊
	 * @param	{number}	favorId - 任务id
	 */
	
	ajax.get({
		ctrl: 'Favor',
		fn: 'favorDetails',
		data: {
			values: {
				id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
				token: $api.getStorage(CONFIG.KEY.TOKEN),
				favorid: args.favorId
			}
		},
		hideLoading: true,
		success: function(ct) {
			
			if(parseInt(ct.workers) < 2){
				return;
			}
			
			var groupIds = [];	//由帮助者id和发布者id由小到大拼接成的字符串
			ct.ongoingby.forEach(function(value, index){
				value.forEach(function(v, i){
					groupIds.push(v.id);
				});
			});
			groupIds.push(ct.memberid);
			groupIds.sort(function(a, b){
				return parseInt(a) - parseInt(b);
			});			
			RongCloud2.joinGroup({
				isCancel: false,
			    groupId: groupIds.join(''),	//任务id
			    groupName: 'Group',	//群聊名称
			    success: function(){
//			    	alert('joinChat success')
			    }
		   });
		}
	});
	
			
};