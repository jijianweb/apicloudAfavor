/*
 * 创建于 2016-1-10
 */

! function(window) {
	var cb = {
		/* 存储表情信息: JSON对象,以 表情字符 为属性名, 以 表情图片URL 为值.*/
		sourcePath: 'widget://res/chatBox/emotion', //表情源文件.
		emotionData: '',
		talkFrame: '', //聊天记录存放区
		isRecored: true, //默认能聊天
		commentPicList: [],
		init: function(args) {
			/*
			 * @param	{string}	scene - 应用场景
			 * 	- taskDetail, 任务详情页面，ongoing 状态
			 *  - taskDetailAllComments, 任务详情全部评论列表
			 *
			 * @param	{string}	talkEvent	发送消息的广播事件
			 * @param	{string}	placeholder - 输入框占位符
			 * @param	{boolean}	isComment - 控制是否有 extras 按钮
			 * @param	{function} inputBar_move - 监听 inputBar 对象的 move 事件（输入框所在区域弹动事件）
			 */
			var self = this,
				panelHeight,
				chatBox = api.require('UIChatBox');
			common = args.common;
			//准备表情
			this.getImgsPaths(this.sourcePath, function(emotion) {
				self.emotionData = emotion;
			});
			chatBox.open({
				placeholder: args.placeholder || '',
				emotionPath: self.sourcePath,
				texts: {
					sendBtn: { //（可选项）JSON对象；发送按钮文字内容，在 iOS 平台上对键盘内按钮无效
						title: 'Send' //（可选项）字符串类型；按钮常态的标题，默认：'发送'
					}
				},
				extras: args.isComment ? null : {
					titleSize: 10,
					titleColor: '#a3a3a3',
					btns: [{
						title: 'Camera',
						normalImg: 'widget://res/chatBox/cam1.png',
						activeImg: 'widget://res/chatBox/cam2.png'
					}, {
						title: 'Album',
						normalImg: 'widget://res/chatBox/album1.png',
						activeImg: 'widget://res/chatBox/album2.png'
					}]
				},
				styles: {
					inputBar: {
						borderColor: '#d9d9d9',
						bgColor: '#f2f2f2'
					},
					inputBox: {
						borderColor: '#B3B3B3',
						bgColor: '#FFFFFF',
						normalImg: 'widget://res/chatBox/bt1.png',
						activeImg: 'widget://res/chatBox/bt2.png'
					},
					emotionBtn: {
						normalImg: 'widget://res/chatBox/face1.png',
						activeImg: 'widget://res/chatBox/face2.png'
					},
					keyboardBtn: {
						normalImg: 'widget://res/chatBox/key1.png',
						activeImg: 'widget://res/chatBox/key2.png'
					},
					extrasBtn: args.isComment ? null : { //附加功能按钮样式
						normalImg: 'widget://res/chatBox/add1.png',
						activeImg: 'widget://res/chatBox/add2.png'
					},
					//	        speechBtn: {//输入框左侧语音按钮样式
					//	        	normalImg: 'widget://res/chatBox/voice1.png',
					//	        	activeImg: 'widget://res/chatBox/voice2.png'
					//	        },
					//	        recordBtn: {  //JSON对象；“按住 录音”按钮的样式
					//		        normalBg: 'widget://res/chatBox/bt1.png',
					//		        activeBg: 'widget://res/chatBox/bt2.png',
					//		        color: '#909090'
					//			    },
					indicator: {
						target: 'both',
						color: '#c4c4c4',
						activeColor: '#9e9e9e'
					},
					sendBtn: { //（可选项）JSON对象；发送按钮样式，本参数对 iOS 平台上的键盘内发送按钮无效
						bg: '#32BBB1', //（可选项）字符串类型；发送按钮背景颜色，支持 rgb、rgba、#、img；默认：#4cc518
						titleColor: '#ffffff', //（可选项）字符串类型；发送按钮标题颜色；默认：#ffffff
						activeBg: '#32BBB1', //（可选项）字符串类型；发送按钮背景颜色，支持 rgb、rgba、#、img；默认：无
						titleSize: 13 //（可选项）数字类型；发送按钮标题字体大小；默认：13
					}
				},
			}, function(ret) {
				switch(ret.eventType) {
					case 'show':
						break;
					case 'send':
						/* 用户输入了表情或者文字. */
						if(ret.msg.match(/^\s+$/)) {
							Tool.toast('Input cannot be empty~');
							return;
						}
						if(ret.msg.match(/^[ ]+$/)) {
							Tool.toast('Input cannot be empty~');
							return;
						}
						if(ret.msg.match(/^[ ]*$/)) {
							Tool.toast('Input cannot be empty~');
							return;
						}
						if(ret.msg.match(/^\s*$/)) {
							Tool.toast('Input cannot be empty~');
							return;
						}
						if(ret.msg) {
							// var sendMsg = self.transText(ret.msg);
							api.sendEvent({
								name: args.talkEvent || 'iTalk',
								extra: {
									content: ret.msg,
									msg: self.transText(ret.msg),
									type: 'txt'
								}
							});
							//				self.chatBoxModule.resignFirstResponder();
						}
						break;
					case 'clickExtras':
						switch(ret.index) {
							case 0:
								/*拍照*/
								if(args.isComment && self.commentPicList.length > 0) {
									api.setFrameAttr({
										name: 'commentPic',
										hidden: false
									});
									break;
								}
								Tool.getOnePic({
									sourceType: 'camera',
									quality: 100,
									success: function(ret) {
										if(ret.data) {
											if(!args.isComment) {
												api.sendEvent({
													name: 'iTalk',
													extra: {
														type: 'img',
														message: {
															content: {
																imagePath: ret.data
															},
															sentTime: new Date().getTime()
														}
													}
												});
											} else {
												var commentPic = [{
													url: ret.data,
													callbackEvent: 'uploadPic' + new Date().getTime()
												}];
												api.openFrame({
													name: 'commentPic',
													url: api.wgtRootDir + '/html/component/comment_pic.html',
													rect: {
														x: 0,
														y: api.frameHeight - panelHeight,
														w: 'auto',
														h: 220
													},
													animation: {
														type: "none", //动画类型（详见动画类型常量）
														subType: "from_right", //动画子类型（详见动画子类型常量）
														duration: 300 //动画过渡时间，默认300毫秒
													},
													pageParam: {
														commentPicList: commentPic
													}
												});
												api.sendEvent({
													name: 'addCommentPic',
													extra: {
														commentPicList: commentPic
													}
												});
											}
										}
									}
								});
								break;
							case 1:
								/*本地相册*/
								if(args.isComment && self.commentPicList.length > 0) {
									api.setFrameAttr({
										name: 'commentPic',
										hidden: false
									});
									break;
								}
								Tool.getSomePic({
									max: args.isComment ? 6 : 9,
									type: 'picture',
									transPath: true,
									success: function(ret) {
										/*重新整理ret的数据结构，使其适配模板结构*/
										var commentPic = [];
										if(!ret.list){
											return;
										}
										ret.list.forEach(function(value, index, arr) {
											value.content = new Object();
											commentPic.push({
												url: value.path,
												callbackEvent: 'uploadPic' + new Date().getTime() + index
											});
											value.content.imagePath = value.path;
											/*发送时间戳作唯一标识*/
											value.sentTime = new Date().getTime() + index;
										});
										if(!args.isComment) {
											api.sendEvent({
												name: 'iTalk',
												extra: {
													type: 'img',
													message: ret.list
												}
											});
										} else {
											api.openFrame({
												name: 'commentPic',
												url: api.wgtRootDir + '/html/component/comment_pic.html',
												rect: {
													x: 0,
													y: api.frameHeight - panelHeight,
													w: 'auto',
													h: 220
												},
												pageParam: {
													commentPicList: commentPic
												}
											});
											api.sendEvent({
												name: 'addCommentPic',
												extra: {
													commentPicList: commentPic
												}
											});
										}
									}
								});
								break;
						}
				}
			});
			chatBox.addEventListener({
				target: 'inputBar',
				name: 'move'
			}, function(ret) {
				var header = $api.dom('#header'),
					headerPos = $api.offset(header);
				if(typeof args.inputBar_move == 'function') {
					args.inputBar_move(ret);
					return;
				}

				panelHeight = ret.panelHeight; //输入框下边缘距离屏幕底部的高度
				if(panelHeight == 0) {
					api.setFrameAttr({
						name: 'commentPic',
						hidden: true
					});
				}
				api.execScript({
					name: common == 0 ? 'comment' : 'talk_with',
					frameName: common == 0 ? 'task_comment' : 'talk_with',
					script: 'scrollToBottom()'
				});
//Tool.toast(api.winHeight)
//Tool.toast(api.winHeight  + '-' + headerPos.h + '-' + ret.inputBarHeight + '-' + ret.panelHeight)
				api.setFrameAttr({
					name: common == 0 ? 'task_comment' : 'talk_with',
					rect: {
						x: 0,
						y: headerPos.h,
						w: api.winWidth,
						h: api.winHeight - headerPos.h - ret.inputBarHeight - ret.panelHeight
					}
				});
			});

			//限制字数
			chatBox.addEventListener({
				target: 'inputBar',
				name: 'valueChanged'
			}, function(ret, err) {
				if(ret) {
					//alert(parseInt(ret.value.length));
					//					alert(JSON.stringify(ret));
					var rnum = parseInt(ret.value.length);
					if(rnum > 500) {
						var rvalue = ret.value.slice(0, 500);
						chatBox.value({
							msg: rvalue
						});
					}
				} else {
					alert(JSON.stringify(err));
				}
			});

			/* chatbox 监听按下 左侧语音按钮 */
			chatBox.addEventListener({
				target: 'inputBar',
				name: 'showRecord'
			}, function(ret) {
				api.setFrameAttr({
					name: 'commentPic',
					hidden: true
				});
			});
			/* chatbox 监听按下 表情 按钮*/
			chatBox.addEventListener({
				target: 'inputBar',
				name: 'showEmotion'
			}, function(ret) {
				api.setFrameAttr({
					name: 'commentPic',
					hidden: true
				});
			});

			/* chatbox 监听按下 附加 按钮*/
			chatBox.addEventListener({
				target: 'inputBar',
				name: 'showExtras'
			}, function(ret) {
				api.setFrameAttr({
					name: 'commentPic',
					hidden: true
				});
			});

			/*注册chatbox监听按下录音监听*/
			chatBox.addEventListener({
				target: 'recordBtn',
				name: 'press'
			}, function(ret) {
				api.sendEvent({
					name: 'isPlay'
				});
				if(api.systemType == 'ios') {
					self.isRecored = false;
					privacy('microphone', function() {
						self.isRecored = true;
						self.openRecordFrame();
					});
					return;
				}
				//打开录音frame
				self.openRecordFrame();
			});
			//取消按录音监听
			chatBox.addEventListener({
				target: 'recordBtn',
				name: 'press_cancel'
			}, function(ret) {
				if(api.systemType == 'ios' && !self.isRecored) {
					return;
				}
				self.stopRecord();
			});
			//监听 移出
			chatBox.addEventListener({
				target: 'recordBtn',
				name: 'move_out'
			}, function(ret) {
				api.sendEvent({
					name: 'record_move_out'
				});
			});
			//监听 取消移出
			chatBox.addEventListener({
				target: 'recordBtn',
				name: 'move_out_cancel'
			}, function(ret) {
				api.sendEvent({
					name: 'record_move_out_cancel'
				});
				/*停止录音*/
				api.stopRecord(function(ret, err) {
					if(ret) {
						var fs = api.require('fs');
						fs.remove({
							path: ret.path
						});
					}
				});
			});
			//监听 移入
			chatBox.addEventListener({
				target: 'recordBtn',
				name: 'move_in'
			}, function(ret) {
				api.sendEvent({
					name: 'record_move_in'
				});
			});
		},
		openRecordFrame: function() {
			api.openFrame({
				name: 'record_mask',
				url: api.wgtRootDir + '/html/component/record_mask.html',
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			/*启动录音逻辑*/
			api.startRecord({
				path: 'fs://record/' + new Date().getTime() + '.amr'
			});
		},
		stopRecord: function() {
			api.closeFrame({
				name: 'record_mask'
			});
			/*录音完毕，启动发送逻辑*/
			api.stopRecord(function(ret, err) {
				if(ret && ret.duration != 0) {
					api.sendEvent({
						name: 'iTalk',
						extra: {
							type: 'vc',
							duration: ret.duration,
							voicePath: ret.path
						}
					});
				} else {
					Tool.toast('说话时间太短~');
					return;
				}
			});
		},
		setValue: function(value) {
			/*设置输入框的值*/
			var self = this,
				chatBox = api.require('UIChatBox');
			chatBox.value({
				msg: value
			});
		},
		getValue: function(callback) {
			/*获取输入框的值*/
			var self = this,
				chatBox = api.require('UIChatBox');
			chatBox.value(function(ret, err) {
				if(ret) {
					if("function" === typeof(callback)) {
						callback(ret.msg);
					}
				} else {
					//alert( JSON.stringify( err ) );
				}
			});
		},
		/*
		 * 一个工具方法: 可以获取 所有表情图片的名称和真实url地址, 以JSON对像形式返回;
		 * 其中以"表情文本"为属性名, 以"图片真实路径"为属性值.
		 */
		getImgsPaths: function(sourcePathOfChatBox, callback) {
			var jsonPath = sourcePathOfChatBox + "/emotion.json";
			api.readFile({
				path: jsonPath
			}, function(ret, err) {
				if(ret.status) {
					var emotionArray = JSON.parse(ret.data),
						emotion = {};
					for(var idx in emotionArray) {
						var emotionItem = emotionArray[idx];

						var emotionText = emotionItem["text"];
						var emotionUrl = "api.wgtRootDir/res/chatBox/emotion/" + emotionItem["name"] + ".png";

						emotion[emotionText] = emotionUrl;
					}

					/* 把 emotion对象 回调出去. */
					if("function" === typeof(callback)) {
						callback(emotion);
					}

				}
			});
		},
		transText: function(text, imgWidth, imgHeight) {
			/*
			 * 将表情文本转换为 img 标签
			 */
			var self = this,
				imgWidth = imgWidth || 25,
				imgHeight = imgHeight || 25;
			//console.log(self.emotionData)

			var regx = /\[(.*?)\]/gm;
			var textTransed = text.replace(regx, function(match) {
				var imgSrc = self.emotionData[match];
				if(!imgSrc) { /* 说明不对应任何表情,直接返回即可.*/
					return match;
				}

				var img = "<img class='expression' src='" + imgSrc + "' />";
				return img;
			});

			return textTransed;
		},
		saveEmotionToFS: function() {
			/*
			 * 将widget://目录下的表情放到fs://目录下
			 */
			var fs = api.require('fs'),
				isExist = fs.existSync({
					path: api.fsDir + '/emotion'
				}).exist;

			if(isExist) {
				return;
			}

			Object.keys(emotionUrl).forEach(function(value, index) {
				// console.log(api.wgtRootDir + emotionUrl[value])
				fs.copyToSync({
					oldPath: api.wgtRootDir + emotionUrl[value],
					newPath: api.fsDir + '/emotion/'
				});
			});

		},
		transToEmotionUrl: function(prifix, text, imgWidth, imgHeight) {
			/*
			 * 将字符串中的表情符号转换为表情对应的图片路径显示出来
			 */
			var self = this,
				imgWidth = imgWidth || 20,
				imgHeight = imgHeight || 20,
				imgName; //表情图片文件名

			var regx = /\[(.*?)\]/gm;
			var textTransed = text.replace(regx, function(match) {
				var imgSrc = emotionUrl[match];
				//截取表情文件名
				// imgName = imgSrc.slice(imgSrc.lastIndexOf('/') + 1);

				if(!imgSrc) { /* 说明不对应任何表情,直接返回即可.*/
					return match;
				}
				imgSrc = prifix + imgSrc;
				// imgSrc = api.fsDir + '/emotion/' + imgName;
				// console.log(imgSrc)
				var img = "<img class='expression' src='" + imgSrc + "' style='vertical-align:middle'/>";
				return img;
			});
			return textTransed;
		},
		getImgsText: function(txt, callback) {
			//表情转文字
			var self = this;
			var jsonPath = self.sourcePath + ".json";

			api.readFile({
				path: jsonPath
			}, function(ret, err) {
				//				console.log('a')
				//				console.log(JSON.stringify(ret, null, 2))
				//				console.log(JSON.stringify(err, null, 2))
				if(ret.status) {
					//					console.log('aaaa')
					var textArray = JSON.parse(ret.data),
						_text = {};

					for(var idt in textArray) {
						var textItem = textArray[idt];

						var textName = textItem["name"];
						var textText = textItem["text"];

						_text[textName] = textText;
					}

					var regx = /<img class=\'expression\' src=\'api.wgtRootDir\/res\/chatBox\/emotion\/(.*?).png\' \/>/gm,
						textTransed = txt.replace(regx, function(match) {
							var reg = /(\&[l,g]t;)|(<img)|(class=\'expression\')|(src=\')|(api.wgtRootDir\/res\/chatBox\/emotion\/)|(\')|(\/>)|(.png)|( )/gm,
								_html = match.replace(reg, function(Rmatch) {
									switch(Rmatch) {
										case '\' \/>':
											return '';
										case '\ ':
											return '';
										case ' ':
											return '';
										case '\'':
											return '';
										case '\/>':
											return '';
										case '<img':
											return '';
										case 'class=\'expression\'':
											return '';
										case 'src=\'':
											return '';
										case '.png':
											return '';
										case 'api.wgtRootDir\/res\/chatBox\/emotion\/':
											return '';
										case '&lt;':
											return '<';
										case '&gt;':
											return '>';
									}
								});
							var text = _text[_html];
							if(!text) {
								return _html;
							}
							return text;
						});
					/* 把 emotion对象 回调出去. */
					if("function" === typeof(callback)) {
						callback(textTransed);
						//						console.log('h2')
					}

				}
			});
		},
		setPlaceholder: function(placeholder) {
			var UIChatBox = api.require('UIChatBox');
			UIChatBox.setPlaceholder({
				placeholder: placeholder
			});
		},
		close: function(){
			var UIChatBox = api.require('UIChatBox');
			UIChatBox.close();
		},
		popupKeyboard: function() {
			var UIChatBox = api.require('UIChatBox');
			UIChatBox.popupKeyboard();
		},
		closeKeyboard: function() {
			var UIChatBox = api.require('UIChatBox');
			UIChatBox.closeKeyboard();
		},
		closeBoard: function() {
			//收起表情、附加功能面板
			var UIChatBox = api.require('UIChatBox');
			UIChatBox.closeBoard();
		}
	};

	window.UIChatBox = cb;

}(window);
