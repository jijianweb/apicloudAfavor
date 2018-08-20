/*
 * 作用：文件上传：图片、音频、视频
 * 创建于 2015-7-18 9：36
 */
!function(window){
	var u = {
		files: [], /*多文件上传*/
		file: {}, //单文件上传
		uploadType: '', //0:单文件上传;1:多文件上传
		qiNiuToken: '',//上传前需要获取七牛上传token
		qiNiuUploadUrl: 'http://upload.qiniu.com',//七牛上传地址
		callbackEvent: '', //所有文件上传完成后的触发事件
		fileKey: '',//文件成功上传至七牛后返回的文件映射地址变量
		init: function(args){
			/*
			 * 上传前作准备，获取需要上传的数据
			 *	参数 json args
			 * 		callbackEvent 所有文件上传完成后的触发事件
			 * 		(默认0)number uploadType	0:单文件上传;1:多文件上传
			 * 		(可选)string callbackEvent 图片上传完毕后(单文件/多文件)，广播回调事件
			 * 		array files 文件数组(uploadType=1)，文件数组元素:
			 * 			[{
			 * 				string url 文件本地地址
			 * 				可选 callbackEvent 图片上传完毕后，广播回调事件
			 * 			}]
			 * 		tag 上传标识	
			 * 		ps: 上传过程中，标签属性upload有5个状态：empty|ready|uploading|done|error
			 */
			this.callbackEvent = args.callbackEvent || '';
			if(args.files instanceof Array && args.files.length!=0){
				this.files = args.files;
				this.uploadType = 1;
			}else{
				this.file = args.file;
			}
			/*执行文件上传*/
			this.run();
		},
		run: function(){
			var self = this;
			if(this.uploadType){
				var fileIndex = 0;
				/*开始上传第一个文件*/
				getQiNiuToken(this.files[fileIndex]);
			}else{
				getQiNiuToken(this.file);
			}
			/*闭包-获取上传token*/
			 function getQiNiuToken(args){
				ajax.get({
					ctrl: 'Common',
					fn: 'upToken',
					hideLoading: true,
					data: {
						values: {
							id: $api.getStorage('memberId'),
							token: $api.getStorage('token')
						}
					},
					success: function(ct){
						self.qiNiuToken = ct;
						single(args);
					}
				});
			}			
			/*begin 闭包-单文件上传*/
			function single(args){
				/*
				 * 执行文件上传
				 * json args
				 * 	string url 文件本地路径
				 * 	可选 callbackEvent 图片上传完毕后，广播回调事件
				 */
				api.ajax({
					url: self.qiNiuUploadUrl,
					method: 'post',
					cache: false,
					timeout: 30,
					report: true,
					tag: args.tag,
					dataType: 'json',
					data: {
						values: {
							token: self.qiNiuToken
						},
						files: {
							file: args.url
						}
					}
				}, function(ret, err){
					/*
					 * @return 
					 * json ret{
					 * 		body{
					 * 			string key
					 * 			string hash
					 * 		}
					 * }
					 * 
					 */
					// alert($api.jsonToStr(ret))
					if(ret.status && ret.status==1){
//						api.hideProgress();
//						alert($api.jsonToStr(ret));
						if(ret.body.key){
							/*成功上传文件，后续逻辑处理*/
							/*上传状态upload为done*/
							
							if(args.callbackEvent){
								self.done(args.callbackEvent, ret.body.key);
//								api.sendEvent({
//									name: args.callbackEvent,
//									extra: {
//										uploadStatus: 'done',
//										localFile: args.url,
//										fileUrlFromQiNiu: self.qiNiuPrefixUrl + '/' + ret.body.key,
//										key: ret.body.key,
//										hash: ret.body.hash
//									}
//								});
							}
							if(self.uploadType){
								fileIndex += 1;
								if(fileIndex < self.files.length){
									/*继续上传下一个文件*/
									getQiNiuToken(self.files[fileIndex]);
								}else{
									/*多文件上传完毕,重置索引, 文件数组, uploadType*/
									fileIndex = 0;
									self.files = [];
									self.uploadType = '';
									if(self.callbackEvent){
										api.sendEvent({
											name: self.callbackEvent
										});
									}									
								}
							}
						}else{
							api.hideProgress();
							if('wifi' != api.connectionType){
								api.toast({
									msg: '当前网络环境不太稳定，建议在wifi下上传',
									duration: 2000,
									location: 'bottom'
								});	
							}
						}
					}else{
						if(ret.status==2){
							api.hideProgress();
							/*上传状态upload状态为error*/
							if('none' === api.connectionType){
								api.toast({
									msg: '网络无法连接，请检查网络设备是否正常',
									location: 'bottom',
									duration: 3000
								});
								return;
							}		
							
							if(args.callbackEvent){
								self.error(args.callbackEvent, args.url);
//								api.sendEvent({
//									name: args.callbackEvent,
//									extra: {
//										uploadStatus: 'error',
//										url: args.url,
//										callbackEvent: args.callbackEvent
//									}
//								});		
							}
							if(self.uploadType){
								fileIndex += 1;
								if(fileIndex < self.files.length){
									/*继续上传下一个文件*/
									getQiNiuToken(self.files[fileIndex]);
								}else{
									/*多文件上传完毕,重置索引*/
									fileIndex = 0;
								}
							}
							api.toast({
								msg: ret.body.error||ret.body,
								location: 'bottom',
								duration: 3000
							});							
						}else{
							/*上传中状态:uploading*/
							if(args.callbackEvent){
								self.uploading(args.callbackEvent, ret.progress);
//								api.sendEvent({
//									name: args.callbackEvent,
//									extra: {
//										uploadStatus: 'uploading',
//										progress: ret.progress
//									}
//								});								
							}							
						}
					}
				});
			}
			/*end 闭包-单文件上传*/
		},
		uploading: function(callbackEvent, progress) {
			if(!$api.dom('[data-callbackEvent="'+ callbackEvent +'"]')) return;
			var pDom = $api.dom('[data-callbackEvent="'+ callbackEvent +'"]'),
					closeDom = $api.dom(pDom, '.close'),
					frmDom = $api.dom(pDom, '.img-frm'),
					imgDom = $api.dom(pDom, '.img'),
					upDom = $api.dom(pDom, '.upload-status'),
					statusDom = $api.dom(pDom, '.status');
			$api.removeCls(upDom, 'hidden');
			$api.text(statusDom, progress + '%');
			$api.attr(pDom, 'data-status', 'uploading');		
		},
		done: function(callbackEvent, key) {
			if(!$api.dom('[data-callbackEvent="'+ callbackEvent +'"]')) return;
			var pDom = $api.dom('[data-callbackEvent="'+ callbackEvent +'"]'),
					closeDom = $api.dom(pDom, '.close'),
					frmDom = $api.dom(pDom, '.img-frm'),
					imgDom = $api.dom(pDom, '.img'),
					upDom = $api.dom(pDom, '.upload-status'),
					statusDom = $api.dom(pDom, '.status');
			$api.addCls(upDom, 'hidden');		
			$api.attr(pDom, 'data-status', 'done');
			$api.attr(pDom, 'data-key', key);
			$api.remove(upDom);
			$api.removeCls(closeDom, 'hidden');		
		},
		error: function(callbackEvent, url) {
			if(!$api.dom('[data-callbackEvent="'+ callbackEvent +'"]')) return;
			var pDom = $api.dom('[data-callbackEvent="'+ callbackEvent +'"]'),
					closeDom = $api.dom(pDom, '.close'),
					frmDom = $api.dom(pDom, '.img-frm'),
					imgDom = $api.dom(pDom, '.img'),
					upDom = $api.dom(pDom, '.upload-status'),
					statusDom = $api.dom(pDom, '.status');
			
			$api.attr(pDom, 'data-status', 'error');
			$api.text(statusDom, '上传失败，点击重新上传');
			$api.removeCls(closeDom, 'hidden');
			
			/*注册重新上传事件*/
			$api.addEvt(upDom, 'click', function(e) {
				e.stopPropagation();
				if($api.attr(pDom, 'data-status') != 'error') return;
				
				$api.text(statusDom, '准备上传');
				$api.attr(pDom, 'data-status', 'ready');
				$api.addCls(closeDom, 'hidden');
				
				UploadAgain(url, callbackEvent);//重新上传
//				Upload.init({
//					file: {
//						url: url,
//						callbackEvent: callbackEvent
//					}
//				});
			});
		}
	};
	
	window.Upload = u;
}(window);