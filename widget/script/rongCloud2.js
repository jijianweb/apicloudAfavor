!function(window){
	var rc = {
		rcId: '',
		init: function(callback){
			/*初始化的状态，如果 CONFIG.xml 中没有设置 appKey 值，会导致失败，错误信息为参数错误
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.init(function(ret, err){
//				alert(JSON.stringify(ret))
				if(ret.status == 'success'){
					// toast('融云初始化成功');
					if('function' === typeof callback){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getCurrentUserId: function(callback){
			/*获取当前连接用户的信息
			 */
			var rong = api.require('rongCloud2');
			rong.getCurrentUserId(function(ret, err){
				if(ret.status == 'success'){
					callback(ret);
				}
			});
		},
		setOnReceiveMessageListener: function(callback){
			/*
			设置接收消息的监听器，请在调用 init 方法之后，调用 connect 方法之前设置
			*/
			var rong = api.require('rongCloud2');
			rong.setOnReceiveMessageListener(function(ret, err){
				if(ret.result){
					callback(ret.result);
				}
			});
		},		
		setConnectionStatusListener: function(){
			/*
				设置连接状态变化的监听器，请在调用 init 方法之后，调用 connect 方法之前设置
			*/
			var rong = api.require('rongCloud2');
			rong.setConnectionStatusListener(function(ret, err){
				if(ret.result && ret.result.connectionStatus){
					var msg;
					switch(ret.result.connectionStatus){
						case 'DISCONNECTED':
							msg = '断开连接';
							break;
						case -1:
							msg = '未知错误';
							break;
						case 'CONNECTED':
//							msg = '连接成功';
							return;
						case 'NETWORK_UNAVAILABLE':
							msg = '网络不可用';
							break;
						case 'CONNECTING':
//							msg = '连接中';
							return;
						case 'KICKED':
							msg = '用户账户在其他设备登录，本机会被踢掉线';
							break;
						case 'SERVER_INVALID':
							msg = '服务器异常或无法连接';
							break;
						case 'TOKEN_INCORRECT':
//							msg = 'Token 不正确';
							break;
					}
					if(CONFIG.debug){
						Debug.alt(JSON.stringify(ret||err))
//						api.toast({
//							msg: msg || '无错误信息',
//							duration: 2000,
//							location: 'top'
//						});
					}
				}
			});
		},
		connect: function(args, callback){
			/*连接融云 IM 服务器，进行后续各种方法操作前务必要先调用此方法
			 *args 内部结构
			 * token 从服务端获取的用户身份令牌
			 * 
			 *@return 返回字段
			 * 	result{
			 * 		userId 当前登录的用户 Id
			 * 	}
			 */
			var	self = this,
					rong = api.require('rongCloud2');
			rong.connect({
				token: args.token
			}, function(ret, err){
				if(ret.status == 'success'){
					// alert('连接融云成功：'+ ret.result.userId);
					if('function' === typeof callback){
						callback(ret);
					}
					// self.rcId = ret.result.userId;
				}else{
					/*处理错误信息*/
					self.disposeError(err);
				}
			});
		},
		disposeError: function(err){
			if(err && err.code){
				var msg;
				switch(parseInt(err.code)){
					/*init、connect、sendTextMessage*/
					case 31003:
						msg = '服务器不可用';
						break;
					case 31004:
						msg = '错误的令牌（Token），Token 解析失败，请重新向身份认证服务器获取 Token';
						break;
					case 31002:
						msg = '可能是错误的 App Key，或者 App Key 被服务器积极拒绝';
						break;
					case 33002:
						msg = '服务端数据库错误';
						break;
					case 31000:
						msg = '服务器超时';
						break;
					case -10000:
						msg = '未调用 init 方法进行初始化';
						break;
					case -10002:
						msg = '输入参数错误';
						break;
					case 30014:
						msg = '发送处理失败';
						break;
					case 30003:
						msg = '服务器超时';
						break;
					case 31009:
						msg = '用户被屏蔽';
						break;
					case 405: 
						msg = '已被对方拉入黑名单中';
						break;
					case -10001:
						msg = '未调用 connect 方法进行连接';
						break;
				}
				if(CONFIG.debug){
					api.alert({
						title: '融云提示',
						msg: '-' + (err.msg || msg)
//						msg: err.code + '-' + (err.msg || msg)
					});
				}
			}
		},
		sendTextMessage: function(args, callback){
			/*发送文字消息
			 *args内部数据结构
			 * conversationType[PRIVATE] 消息的会话类型，通过改变消息会话类型，可以发送单聊消息、讨论组消息、群聊消息、聊天室消息
			 * targetId 消息接收方的id
			 * text 消息的文字内容
			 * extra 消息的附加信息
			 * prepare 消息发送准备时的回调
			 * success 消息发送成功时回调
			 * error 消息发送失败时回调
			 */
			console.log(JSON.stringify(args,null,2))
			var rong = api.require('rongCloud2'),
					self = this;
			rong.sendTextMessage({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				text: args.text,
				extra: args.extra || ''
			}, function(ret, err){
				switch(ret.status){
					case 'prepare':
						if(typeof args.prepare === 'function'){
							args.prepare(ret);
						}
						break;
					case 'success':
						if(typeof args.success === 'function'){
							args.success(ret);
							self.sendSuccess(ret);
						}
						break;
					case 'error':
						if(typeof args.error === 'function'){
							args.error(ret, err);
							self.sendError(ret);
							self.disposeError(err);
						}
						break;
				}
			});
		},
		sendVoiceMessage: function(args, callback){
			/*发送语音消息
			 *args内部数据结构
			 * conversationType[PRIVATE]
			 * targetId
			 * voicePath 语音文件的路径，支持 fs://，如：fs:///voice/123.amr。文件要求为 AMR 格式
			 * duration 语音消息的时长，单位为秒
			 * extra 消息的附加信息
			 * prepare 消息发送准备时的回调
			 * success 消息发送成功时回调
			 * error 消息发送失败时回调
			 */
			var rong = api.require('rongCloud2'),
					self = this;
					
			rong.sendVoiceMessage({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				voicePath: args.voicePath,
				duration: args.duration,
				extra: args.extra || ''
			}, function(ret, err){
				switch(ret.status){
					case 'prepare':
						if(typeof args.prepare === 'function'){
							args.prepare(ret);
						}
						break;
					case 'success':
						if(typeof args.success === 'function'){
							args.success(ret);
							self.sendSuccess(ret);
						}
						break;
					case 'error':
						if(typeof args.error === 'function'){
							args.error(ret, err);
							self.sendError(ret);
						}else{
							self.disposeError(err);
						}
						break;
				}
			});
		},
		playVoice: function(_this){
			var voicePath = $api.attr(_this, 'voicePath'),
					animateDoms = $api.domAll(_this, 'animate'),
					extra = $api.attr(_this, 'extra'),
					messageId = $api.attr(_this, 'data-messageId'),
					playingDom = $api.dom('[playing="true"]'),
					playingAnimateDoms = playingDom ? $api.domAll(playingDom, 'animate') : '',
					self = this,
					isThisPlaying = false;
			
			/*检查是否有音频正在播放*/
			if(playingDom){
				if($api.attr(_this, 'playing') == 'true') {
					isThisPlaying = true;//当前正在播放的音频是否点击的音频
				}
				$api.attr(playingDom, 'playing', 'false');
				api.stopPlay();//停止当前正在播放的音频
				for(var j = 0;j<playingAnimateDoms.length;j++){
					playingAnimateDoms[j].endElement();
				}
				if(isThisPlaying) return;
			}
			api.startPlay({
				path: voicePath
			}, function(ret, err){
				$api.attr(_this, 'playing', 'false');
			});
			$api.attr(_this, 'playing', 'true');
			for(var i=0;i<animateDoms.length;i++){
				animateDoms[i].beginElement();
			}
			/*判读是否未读
			 */
			if($api.hasCls(_this, 'new')){
//				Debug.alt(messageId)
				extra = JSON.parse(extra);
				extra.isRead = 1;
				this.setMessageExtra({
					messageId: messageId,
					value: JSON.stringify(extra),
					success: function(){
						$api.removeCls(_this, 'new');//去除未读红点
					}
				});
			}
		},
		sendSuccess: function(ret, args) {
			if(args && !$api.dom('[data-sentTime="' + args.sentTime + '"]')) return;
			//发送文本或语音或图片成功
			var value = ret.result.message,
					messageDom = $api.dom('[data-messageId="'+ value.messageId +'"]'),
					listDom = $api.closest(messageDom, '.list-view'),
					msgErrDom = $api.dom(listDom, '.error'),
					msgSendDom = $api.dom(listDom, '.sending');
			$api.addCls(msgSendDom, 'hidden');
			$api.addCls(msgErrDom, 'hidden');
			$api.attr(messageDom, 'data-sentStatus', 'success');
		},
		sendError: function(ret, args) {
			if(args && args.type == 'gift'){
				if(args && !$api.dom('[data-sentTime="' + args.content.sentTime + '"]')) return;
			}else{
				if(args && !$api.dom('[data-sentTime="' + args.sentTime + '"]')) return;
			}
			//发送文本或语音或图片失败
			if(ret.result){
				var value = ret.result.message,
					messageDom = $api.dom('[data-messageId="'+ value.messageId +'"]'),
					listDom = $api.closest(messageDom, '.list-view'),
					msgErrDom = $api.dom(listDom, '.error'),
					msgSendDom = args ? '' : $api.dom(listDom, '.sending');
				if(!args) $api.addCls(msgSendDom, 'hidden');
				$api.removeCls(msgErrDom, 'hidden');
				$api.attr(messageDom, 'data-sentStatus', 'error');
			}
		},
		recallMsg: function(args, template) {
			/*获取撤回消息的messageId，用于设置消息的附加信息
			 * 撤回消息
			 */
			var data = JSON.parse(args.message.content.data),
					msgTime = data.msgTime,
					name = data.name,
					msgDom = $api.dom('[data-sentTime="'+msgTime+'"]'),
					listDom = $api.closest(msgDom, '.list-view'),
					messageId = $api.attr(msgDom, 'data-messageId');
			this.setMessageExtra({
				messageId: messageId,
				value: '{\"msgTime\": "'+msgTime+'",\"type\": "recallMsg"}',
				success: function(ret) {
					$api.remove(listDom);		
					T.append(args.container, template, args.message);
				}
			});
		},
		sendCommandMessage: function(args, callback) {
			/*
			 * 发送命令消息，您需要这种类型的消息时可以直接使用，不需要再自定义。此消息不保存、不计数。
			 *args内部结构
			 * targetId 消息的接收方 Id
			 * name 命令的名称(现用于发送命令撤回消息 recallMsg)
			 * data 命令的数据('{\"msgTime\": "'+发送消息时的时间戳+'"}')
			 * success 回调
			 */
			var rong = api.require('rongCloud2');
			rong.sendCommandMessage({
        conversationType: 'PRIVATE',
        targetId: args.targetId.toString(),
        name: args.name.toString(),
        data: args.data.toString()
	    }, function (ret, err) {
	    	switch(ret.status){
					case 'prepare':
						if(typeof args.prepare === 'function'){
							args.prepare(ret);
						}
						break;
					case 'success':
						if(typeof args.success === 'function'){
							args.success(ret);
						}
						break;
					case 'error':
						if(typeof args.error === 'function'){
							args.error(ret, err);
						}
						break;
				}
		  });
		},
		setMessageExtra: function(args){
			/*设置消息的附加信息，此信息只保存在本地
			 *args内部结构
			 * messageId 消息 Id
			 * value 消息附加信息，最大 1024 字节
			 * success 回调
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			
			rong.setMessageExtra({
				messageId: parseInt(args.messageId),
				value: args.value
			}, function(ret, err){
				if(ret.status == 'success'){
					if(typeof args.success === 'function'){
						args.success();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		render: function(args){
			/*用于把消息数据拼接渲染
			 *args 内部数据
			 * message 类型：数组/JSON;消息类型三种：文字、图片、语音
			 * container 匹配存放消息节点的父元素的css选择器
			 * template 字符串类型，模板名称，格式：文本|语音|图片|撤回|礼物
			 * type 渲染的类型，历史消息(history[默认])、实时最新消息(new)
			 */
			var template = args.template.split('|');
			if(args.type == 'new'){
				//渲染新消息
				switch(args.message.objectName){
					case 'RC:TxtMsg'://文本类型
						T.append(args.container, template[0], args.message);
						break;
					case 'RC:VcMsg'://语音类型
						T.append(args.container, template[1], args.message);
						break;
					case 'RC:ImgMsg'://图片类型
						if(args.message && args.message.content && JSON.parse(args.message.content.extra).type == 'gift'){
							T.append(args.container, template[5], args.message);
						}else{
							T.append(args.container, template[2], args.message);
						}
						break;
					case 'RC:CmdMsg'://命令类型
						if(args.message.content.name && args.message.content.name == 'recallMsg') {
							this.recallMsg(args, template[3]);
						}
						break;
					case 'RC:CmdNtf'://命令信息
						if( typeof args.message.content.data == 'string'){
							args.message.content.data=$api.strToJson(args.message.content.data);
						}
						if(args.message.extra == 'videoAndVoice') {
							T.append(args.container, template[4], args.message);
						}else if(value.content.name=='videoAndVoice'){
							args.message.extra='videoAndVoice';
							T.prepend(args.container, template[4], args.message);
							RongCloud2.setMessageExtra({
				        		messageId:args.message.messageId,
				        		value:'videoAndVoice'
				        	},function(ret,err){
				        	});
						}
						break;
					case 'RC:CmdMsg'://命令信息
						if( typeof args.message.content.data == 'string'){
							args.message.content.data=$api.strToJson(args.message.content.data);
						}
						if(args.message.extra == 'videoAndVoice') {
							T.append(args.container, template[4], args.message);
						}else if(value.content.name=='videoAndVoice'){
							args.message.extra='videoAndVoice';
							T.prepend(args.container, template[4], args.message);
							RongCloud2.setMessageExtra({
				        		messageId:args.message.messageId,
				        		value:'videoAndVoice'
				        	},function(ret,err){
				        	});
						}
						break;
				}				
			}else{
				//渲染历史消息
				if(args.message instanceof Array && args.message.length > 0){
					args.message.forEach(function(value, index, arr){
						switch(value.objectName){
							case 'RC:TxtMsg'://文本类型
								if(value.extra && JSON.parse(value.extra).type == 'recallMsg') {
									T.prepend(args.container, template[3], value);
								}else {
									T.prepend(args.container, template[0], value);
								}
								//T.prepend(args.container, template[0], value);
								break;
							case 'RC:VcMsg'://语音类型
								if(value.extra && JSON.parse(value.extra).type == 'recallMsg') {
									T.prepend(args.container, template[3], value);
								}else {
									T.prepend(args.container, template[1], value);
								}
								//T.prepend(args.container, template[1], value);
								break;
							case 'RC:ImgMsg'://图片类型
								if(value.extra && JSON.parse(value.extra).type == 'recallMsg') {
									T.prepend(args.container, template[3], value);
								}else if(value.content && value.content.extra && JSON.parse(value.content.extra).type == 'gift'){
									T.prepend(args.container, template[5], value);
								}else {
									T.prepend(args.container, template[2], value);
								}
								//T.prepend(args.container, template[2], value);
								break;
							case 'RC:CmdNtf'://命令信息
								if( typeof value.content.data == 'string'){
									value.content.data=$api.strToJson(value.content.data);
								}
								if(value.extra == 'videoAndVoice') {
									T.prepend(args.container, template[4], value);
								}else if(value.content.name=='videoAndVoice'){
									value.extra='videoAndVoice';
									T.prepend(args.container, template[4], value);
									RongCloud2.setMessageExtra({
						        		messageId:value.messageId,
						        		value:'videoAndVoice'
						        	},function(ret,err){
						        	});
								}
								break;
							case 'RC:CmdMsg'://命令信息
								if( typeof value.content.data == 'string'){
									value.content.data=$api.strToJson(value.content.data);
								}
								if(value.extra == 'videoAndVoice') {
									T.prepend(args.container, template[4], value);
								}else if(value.content.name=='videoAndVoice'){
									value.extra='videoAndVoice';
									T.prepend(args.container, template[4], value);
									RongCloud2.setMessageExtra({
						        		messageId:value.messageId,
						        		value:'videoAndVoice'
						        	},function(ret,err){
						        	});
								}
								break;
						}
						
						/*处理时间*/
						if(index < arr.length - 1){
							if(value.sentTime - arr[index+1].sentTime > 1000*60*60){
								T.prepend(args.container, 'datetime', {datetime:value.sentTime});
							}
						}else{
							T.prepend(args.container, 'datetime', {datetime:value.sentTime});
						}
					});
				}
			}
		},		
		sendImageMessage: function(args){
			/*发送图片消息
			 *args 内部结构
			 * targetId 接收方id
			 * file json类型，当拍照上传时，一般用该参数，内部结构如下：
			 * {
			 	*  content
			 	*  {
			 	* 	 imagePath 文件本地地址
			 	* 	 extra 针对条图片消息的附加信息，可为空
			 	*  }
			 * }
			 * files 数组类型，适用于本地多图片上传时使用，内部结构与file一致
			 * prepare 每条消息发送准备时的回调
			 * progress 每条消息发送中的回调
			 * success 每条消息发送成功后的回调
			 * error 每条消息发送失败时的回调
			 * [暂弃用]callbackEvent 所有图片上传完毕后(单文件/多文件)，广播回调事件，可为空
			 * ------------------------------
			 * 预定义变量：
			 * fileIndex 应用于多图片上传，遍历files数组的索引变量
			 * conversationType[PRIVATE]
			 */
			var rong = api.require('rongCloud2'),
					self = this,
					UIMediaScanner = api.require('UIMediaScanner'),
					fileIndex = 0;
			if(args.file){
				single(args.file);
			}else{
				single(args.files[fileIndex]);
//				if(api.systemType == 'ios'){
//					//针对ios端多图片发送时的路径转换
//					UIMediaScanner.transPath({
//						path: args.files[fileIndex].content.imagePath
//					}, function(ret, err){
//						args.files[fileIndex].content.imagePath = ret.path;
//						single(args.files[fileIndex]);
//					});				
//				}else{
//					single(args.files[fileIndex]);
//				}
			}
			
			function single(args2){
				/*单图片发送
				 *args2内部结构, 即单张图片的数据
				 * content
				 * {
				 * 	 imagePath 文件本地路径
				 * 	 extra 针对条图片消息的附加信息，可为空
				 * }
				 */
				//console.log(args.conversationType + ':' + args.targetId + ':' + args2.content.imagePath + ':' + args2.content.extra);
				rong.sendImageMessage({
					conversationType: args.conversationType || 'PRIVATE',
					targetId: args.targetId.toString(),
					imagePath: args2.content.imagePath,
					extra: args2.content.extra || ''
				}, function(ret, err){
					switch(ret.status){
						case 'prepare':
							if(typeof args.prepare === 'function'){
								args.prepare(ret, args2);
							}
							break;
						case 'progress':
							if(typeof args.progress === 'function'){
								args.progress(ret, args2);
							}
							break;
						case 'success':
							if(typeof args.success === 'function'){
								args.success(ret, args2);
								self.sendSuccess(ret, args2);
								if(args.files){
									fileIndex += 1;
									if(fileIndex < args.files.length){
										/*继续发送下一条图片消息*/
										single(args.files[fileIndex]);
//										if(api.systemType == 'ios'){
//											//针对ios端多图片发送时的路径转换
//											UIMediaScanner.transPath({
//												path: args.files[fileIndex].content.imagePath
//											}, function(ret, err){
//												args.files[fileIndex].content.imagePath = ret.path;
//												single(args.files[fileIndex]);
//											});
//										}else{
//											single(args.files[fileIndex]);
//										}
									}else{
										/*多图片消息发送完毕，重置索引*/
										fileIndex = 0;
										args.files = [];
									}
								}
							}
							break;
						case 'error':
							if(typeof args.error === 'function'){
								args.error(ret, err, args2);
								self.sendError(ret, args2);
							}
							/*继续发送下一条图片消息*/
							self.disposeError(err);
							if(args.files){
									fileIndex += 1;
									if(fileIndex < args.files.length){
										/*继续发送下一条图片消息*/
										single(args.files[fileIndex]);
//										if(api.systemType == 'ios'){
//											//针对ios端多图片发送时的路径转换
//											UIMediaScanner.transPath({
//												path: args.files[fileIndex].content.imagePath
//											}, function(ret, err){
//												args.files[fileIndex].content.imagePath = ret.path;
//												single(args.files[fileIndex]);
//											});
//										}else{
//											single(args.files[fileIndex]);
//										}
									}else{
										/*多图片消息发送完毕，重置索引*/
										fileIndex = 0;
										args.files = [];
									}
								}
							break;
					}
				});
			}
		},
		getConversationList: function(callback){
			//获取会话列表
			var rong = api.require('rongCloud2');
			rong.getConversationList(function(ret, err){
				if(ret.status == 'success'){
					callback(ret.result);
				}
			});
		},
		getConversation: function(args){
			/*获取某一会话信息
			 *args 结构
			 * conversationType[PRIVATE]
			 * targetId
			 * success 回调
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getConversation({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof args.success === 'function'){
						args.success(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		removeConversation: function(args){
			/*从会话列表中移除某一会话，但是不删除会话内的消息
			 *如果此会话中有新的消息，该会话将重新在会话列表中显示，并显示最近的历史消息
			 *args 内部结构
			 * conversationType[PRIVATE]
			 * targetId
			 * success
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.removeConversation({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status == 'success'){
					if('function' === typeof args.success){
						args.success();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		clearMessages: function(args){
			/*清空某一会话的所有聊天消息记录
			 *args 内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 * success 
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.clearMessages({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status === 'success'){
					if('function' === typeof args.success){
						args.success();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		clearConversations: function(args, callback){
			/*清空所有会话及会话消息
			 *args 内部结构
			 * conversationTypes[PRIVATE]
			 */
			
			var rong = api.require('rongCloud2');
			rong.clearConversations({
				conversationTypes: args.conversationTypes || 'PRIVATE'
			}, function(ret, err){
				if(ret.status == 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}
			});
		},
		joinGroup: function(args){
			/*
			 * 加入群聊
			 * param	{boolean}	isCancel - 是否取消创建群聊
			 * param	{string}	groupId
			 * param	{string}	groupName
			 */
			var rong = api.require('rongCloud2');
			
			if(args.isCancel){
				args.success();
				return;
			}
			
			rong.joinGroup({
			    groupId: args.groupId.toString(),	//任务id
			    groupName: args.groupName	//群聊名称
			}, function(ret, err) {
				if(ret.status == 'success'){
					args.success();
				}else{
					if(api.debug){
						alert(JSON.stringify(ret||err))
					}
				}
			});
		},
		setConversationToTop: function(args, callback){
			/*设置某一会话为置顶或者取消置顶
			 *args 内部结构
			 * conversationType[PRIVATE] 
			 * targetId
			 * isTop 是否置顶
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.setConversationToTop({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId,
				isTop: args.isTop
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}
			});
		},
		getLatestMessages: function(args, callback){
			/*获取某一会话的最新消息记录
			 *args 内部结构
			 * conversationType[PRIVATE]
			 * targetId
			 * count 要获取的消息数量
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getLatestMessages({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				count: parseInt(args.count)
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getHistoryMessages: function(args, callback){
			/*获取某一会话的历史消息记录
			 *args 内部结构
			 * conversationType[PRIVATE]
			 * targetId
			 * oldestMessageId[-1] 最后一条消息的 Id，获取此消息之前的 count 条消息，没有消息第一次调用应设置为: -1
			 * count 要获取的消息数量
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getLatestMessages({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				oldestMessageId: parseInt(args.oldestMessageId),
				count: args.count
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getHistoryMessagesByObjectName: function(args, callback){
			/*按照消息类型获取历史消息记录
			 *args 内部结构
			 * conversationType[PRIVATE]
			 * targetId
			 * objectName[RC:TxtMsg] 消息类型标识
			 * oldestMessageId[-1]
			 * count
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getHistoryMessagesByObjectName({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				objectName: args.objectName || 'RC:TxtMsg',
				oldestMessageId: parseInt(args.oldestMessageId) || -1,
				count: args.count
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		deleteMessages: function(args){
			/*删除指定的一条或者一组消息
			 *args 内部结构
			 * messageIds 数字数组类型, 要删除的消息 Id 数组
			 * success 执行成功后的回调
			 */
//			console.log(JSON.stringify(args));
			var rong = api.require('rongCloud2'),
					self = this;
			rong.deleteMessages({
				messageIds: args.messageIds
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof args.success === 'function'){
						args.success();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getTotalUnreadCount: function(callback){
			/*获取所有未读消息数
			 *@return
			 * status: 'success',
			 * result: 12 // 未读消息数
			 */
			var rong = api.require('rongCloud2');
			rong.getTotalUnreadCount(function(ret, err){
				if(ret.status === 'success'){
					callback(parseInt(ret.result));
				}
			});
		},
		getUnreadCount: function(args, callback){
			/*获取来自某用户(某会话)的未读消息数
			 *args 内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 */
			var rong = api.require('rongCloud2');
			rong.getUnreadCount({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status == 'success'){
					callback(ret.result);
				}
			});
		},
		getUnreadCountByConversationTypes: function(args){
			/*获取某（些）会话类型的未读消息数
			 *args 内部结构
			 * conversationTypes[PRIVATE] 字符串数组类型
			 * success 成功获取信息后回调
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getUnreadCountByConversationTypes({
				conversationTypes: args.conversationTypes || ['PRIVATE']
			}, function(ret, err){
				if(ret.status === 'success'){
					args.success(ret.result);
				}else{
					self.disposeError(err);
				}
			});
		},
		setMessageReceivedStatus: function(args, callback){
			/*设置接收到的消息状态
			 *args 内部结构
			 * messageId 消息 Id
			 * receivedStatus 设置接收到的消息状态
			 * 	UNREAD //未读
			 * 	READ // 已读
			 * 	LISTENED // 已收听
			 * 	DOWNLOADED // 已下载
			 */
			var rong = api.require('rongCloud2');
			rong.setMessageReceivedStatus({
				messageId: args.messageId,
				receivedStatus: args.receivedStatus
			}, function(ret, err){
				if(ret.status == 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}				
			});
		},
		clearMessagesUnreadStatus: function(args){
			/*清除某一会话的消息未读状态
			 *args 内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 * success 执行成功后的回调
			 */
			var rong = api.require('rongCloud2');
			rong.clearMessagesUnreadStatus({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status == 'success'){
					if(typeof args.success === 'function'){
						args.success();
					}
				}
			});
		},
		getTextMessageDraft: function(args, callback){
			/*获取某一会话的文字消息草稿
			 *args 内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 * 
			 *@return
			 * result: 'Hello w' // 草稿的文字内容
			 */
			var rong = api.require('rongCloud2');
			rong.getTextMessageDraft({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId
			}, function(ret, err){
				if(ret.status === 'success'){
					callback(ret);
				}
			});
		},
		saveTextMessageDraft: function(args, callback){
			/*保存某一会话的文字消息草稿
			 *args 内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 * content 草稿的文字内容
			 */
			var rong = api.require('rongCloud2');
			rong.saveTextMessageDraft({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				content: args.content
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}
			});
		},
		clearTextMessageDraft: function(args, callback){
			/*清除某一会话的文字消息草稿
			 *args内部结构
			 * conversationType['PRIVATE']
			 * targetId
			 */
			var rong = api.require('rongCloud2');
			rong.clearTextMessageDraft({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}
			});
		},
		logout: function(callback){
			/*注销登录(不再接收 Push 消息)
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.logout(function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		addToBlacklist: function(args, callback){
			/*将某个用户加到黑名单中
			 *args 内部结构
			 * userId 要加入黑名单的用户 Id
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.addToBlacklist({
				userId: args.userId
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		removeFromBlacklist: function(args, callback){
			/*将个某用户从黑名单中移出
			 *args 内部结构
			 * userId	要移出黑名单的用户 Id
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.removeFromBlacklist({
				userId: args.userId
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getBlacklistStatus: function(args, callback){
			/*获取某用户是否在黑名单中
			 *args 内部结构
			 * userId	要移出黑名单的用户 Id
			 * 
			 *@return
			 * status: 'success', // 状态码：success / error
			 * result: 1 // 1-不在黑名单；0-在黑名单
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getBlacklistStatus({
				userId: args.userId
			}, function(ret, err){
				if(ret.status === 'success'){
					callback(ret);
				}else{
					self.disposeError(err);
				}
			});
		},
		getBlacklist: function(callback){
			/*获取当前用户的黑名单列表
			 *@return
			 * status: 'success',
			 * result: ['aaa','bbb']
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.getBlacklist(function(ret, err){
				if(ret.status === 'success'){
					callback(ret);
				}else{
					self.disposeError(err);
				}
			});
		},
		setNotificationQuietHours: function(args, callback){
			/*设置消息通知免打扰时间
			 *args 内部结构
			 * startTime 类型：字符串, 起始时间 格式 HH:MM:SS
			 * spanMinutes 类型：数字, 间隔分钟数 0 < spanMinutes < 1440。
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.setNotificationQuietHours({
				startTime: args.startTime,
				spanMinutes: args.spanMinutes
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getConversationNotificationStatus: function(args){
			/*获取某一会话的通知状态
			 *args 结构
			 * conversationType['PRIVATE']
			 * targetId
			 * success
			 * 
			 *@ret
			 * 	result{
			 * 		code 状态码，0：免打扰 / 1：提醒
			 * 		notificationStatus: 'DO_NOT_DISTURB' // 参见 会话通知提醒状态 枚举
			 *  }
			 */
			var rong = api.require('rongCloud2'),
					self = this;
					
			rong.getConversationNotificationStatus({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString()
			}, function(ret, err){
				if(ret.status === 'success'){
					if(typeof args.success === 'function'){
						args.success(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		setConversationNotificationStatus: function(args){
			/*设置某一会话的通知状态
			 *args 内部结构
			 * conversationType[PRIVATE]
			 * targetId
			 * notificationStatus 会话通知提醒状态 
			 * 	DO_NOT_DISTURB 免打扰
			 * 	NOTIFY 提醒
			 * success 回调
			 * 
			 *@ret
			 * result{
			 * 	code: 0 // 状态码，0：免打扰 / 1：提醒
			 * 	notificationStatus: 'DO_NOT_DISTURB' // 参见 会话通知提醒状态 枚举
			 * }
			 */
			var rong = api.require('rongCloud2'),
					self = this;
					
			api.showProgress({
				title: args.notificationStatus === 'NOTIFY' ? '取消免打扰...' : '开启免打扰...',
				modal: true
			});
			rong.setConversationNotificationStatus({
				conversationType: args.conversationType || 'PRIVATE',
				targetId: args.targetId.toString(),
				notificationStatus: args.notificationStatus
			}, function(ret, err){
				api.hideProgress();
				if(ret.status === 'success'){
					if(typeof args.success === 'function'){
						args.success(ret.result);
					}
				}else{
					self.disposeError(err);
				}
			});
		},		
		removeNotificationQuietHours: function(callback){
			/*移除消息通知免打扰时间
			 * 
			 */
			var rong = api.require('rongCloud2'),
					self = this;
			rong.removeNotificationQuietHours(function(ret, err){
				if(ret.status === 'success'){
					if(typeof callback === 'function'){
						callback();
					}
				}else{
					self.disposeError(err);
				}
			});
		},
		getRongToken: function (callback){
			//获取融云 token
			ajax.get({
				ctrl: CONFIG.GET_RONG_TOKEN_API.CTRL,
				fn: CONFIG.GET_RONG_TOKEN_API.FN,
				data: {
					values: {
						id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
						token: $api.getStorage(CONFIG.KEY.TOKEN)
					}
				},
				hideLoading: true,
				showError: false,
				showProgress: false,
				success: function(ct) {
					if('function' === typeof callback){
						callback(ct);
					}
				}
			});
		}			
	};
	window.RongCloud2 = rc;
}(window);
