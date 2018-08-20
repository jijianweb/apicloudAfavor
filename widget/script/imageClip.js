/*
 * 图片截取模块
 */
!function(window){
	var ic = {
		touchstartX: '',
		touchstartY: '',
		fingersCount: 0,
		createScene: function(){
			/*创建场景
			 */
			var main = document.querySelector('#main');
			
			this.imgCanvas = document.createElement('canvas');
			this.clipCanvas = document.createElement('canvas');
			
			main.appendChild(this.imgCanvas);
			main.appendChild(this.clipCanvas);
			
			this.clipCanvas.id = 'clip';
			this.clipCxt = this.clipCanvas.getContext('2d');
			
			this.imgCanvas.id = 'img';
			this.imgCxt = this.imgCanvas.getContext('2d');
			
			/*设置画布宽度*/
			this.clipCanvas.width = this.imgCanvas.width = 
			this.clipCanvas.style.width = this.imgCanvas.style.width = 
			document.body.clientWidth;
			
			/*设置画布高度*/
			this.clipCanvas.height = this.imgCanvas.height = 
			this.clipCanvas.style.height = this.imgCanvas.style.height = 
			document.body.clientHeight;			
			
			this.rectWidth = this.imgCanvas.width * 0.9; //截图区域的宽度
			this.clipRectX = (this.imgCanvas.width - this.rectWidth) / 2; /*截图区域的X坐标位置*/
			this.clipRectY = (this.imgCanvas.height - this.rectWidth) / 2, /*截图区域的Y坐标位置*/
			
			this.fix = new Object();
			this.isDrag = false; //图片是否可拖拽, 对应drag事件
			this.isMove = false;//图片是否可移动, 对应touchmove事件
			
			this.clipCxt.save();
			this.clipCxt.fillStyle = 'rgba(0, 0, 0, 0.5)';
			this.clipCxt.fillRect(0, 0, this.clipCanvas.width, this.clipCanvas.height);
			this.clipCxt.globalCompositeOperation = 'destination-out';
			this.clipCxt.fillRect(this.imgCanvas.width * 0.1 / 2, (this.imgCanvas.height - this.rectWidth) / 2, this.rectWidth, this.rectWidth);
			this.clipCxt.restore();
			
			/*白色方框*/
			this.clipCxt.strokeStyle = '#bbb';
			this.clipCxt.lineWidth = 1;
			this.clipCxt.strokeRect(this.imgCanvas.width * 0.1 / 2, (this.imgCanvas.height - this.rectWidth) / 2, this.rectWidth, this.rectWidth);
			
		},
		init: function(args){
			/*args 内部结构
			 * imgSrc 图片的本地路径
			 * callbackEvent 回调事件
			 */
			try{
				api.showProgress({
					title: '图片加载中...',
					modal: false
				});
			}catch(e){
				
			}
			this.createScene();
			var img = new Image(),
					self = this,
					clipRectX = this.clipRectX,
					clipRectY = this.clipRectY,
					rectWidth = this.rectWidth,
					isDrag = this.isDrag,
					isMove = this.isMove,
					fix = this.fix,
					imgCanvas = this.imgCanvas,
					imgCxt = this.imgCxt,
					clipCanvas = this.clipCanvas,
					clipCxt = this.clipCxt,
					scaleWidth, scaleHeight, 
					scaleX, scaleY;
					
					
			img.src = args.imgSrc;
			img.onload = function(){
				self.positionCenter({
					imgWidth: img.width,
					imgHeight: img.height,
					modelWidth: self.rectWidth,
					modelHeight: self.rectWidth
				}, function(ret){
					self.fix.x = ret.x;
					self.fix.y = ret.y;
					self.fix.width = ret.width;
					self.fix.height = ret.height;
					
					self.imgCxt.drawImage(img, ret.x, ret.y, ret.width, ret.height);
					/*图片加载完成, 隐藏进度条*/
					try{
						api.hideProgress();
					}catch(e){
						
					}
					
					touch.on('#clip', 'touchstart', function(ev){
						ev.preventDefault();
						self.fingersCount = ev.touches.length;
						if(ev.touches.length != 1){
							return;
						}			
						self.touchstartX = ev.touches[0].clientX;
						self.touchstartY = ev.touches[0].clientY;
						
						if(self.touchstartX > clipRectX && self.touchstartX < clipRectX + rectWidth){
							if(self.touchstartY > clipRectY && self.touchstartY < clipRectY + rectWidth){
								isMove = true;
							}else{
								isMove = false;
							}
						}else{
							isMove = false;
						}
						//pos = recognizeArea(ev);
					});					
					
					touch.on('#clip', 'touchmove', function(ev){
						if(!isMove){
							return;
						}
						if(self.fingersCount != 1){
							return;
						}						
						var distanceX = ev.changedTouches[0].clientX - self.touchstartX,
								distanceY = ev.changedTouches[0].clientY - self.touchstartY,
								x, y;
						
						if(fix){
							if(fix.width > rectWidth){
								/*水平方向可移动*/
								if(fix.x + distanceX >= clipRectX - (fix.width - rectWidth) && fix.x + distanceX <= clipRectX){
									x = fix.x + distanceX
								}else{
									if(fix.x + distanceX < clipRectX - (fix.width - rectWidth)){
										x = clipRectX - (fix.width - rectWidth);
									}else if(fix.x + distanceX > clipRectX){
										x = clipRectX;
									}
								}
							}else{
								/*水平方向不可移动*/
								x = clipRectX;
							}
							
							if(fix.height > rectWidth){
								/*垂直方向可移动*/
								if(fix.y + distanceY >= clipRectY - (fix.height - rectWidth) && fix.y + distanceY <= clipRectY){
									y = fix.y + distanceY;
								}else{
									if(fix.y + distanceY < clipRectY - (fix.height - rectWidth)){
										y = clipRectY - (fix.height - rectWidth);
									}else if(fix.y + distanceY > clipRectY){
										y = clipRectY;
									}
								}						
							}else{
								/*垂直方向不可移动*/
								y = clipRectY;
							}		
							imgCxt.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
							imgCxt.drawImage(img, x, y, fix.width, fix.height);								
						}
					});					
					
					touch.on('#clip', 'touchend', function(ev){
						if(!isMove){
							return;
						}
						if(self.fingersCount != 1){
							return;
						}
						var distanceX = ev.changedTouches[0].clientX - self.touchstartX,
								distanceY = ev.changedTouches[0].clientY - self.touchstartY,
								x, y;

						if(fix.width > rectWidth){
							/*水平方向可移动*/
							if(fix.x + distanceX >= clipRectX - (fix.width - rectWidth) && fix.x + distanceX <= clipRectX){
								x = fix.x + distanceX;
							}else{
								if(fix.x + distanceX < clipRectX - (fix.width - rectWidth)){
									x = clipRectX - (fix.width - rectWidth);
								}else if(fix.x + distanceX > clipRectX){
									x = clipRectX;
								}
							}						
						}else{
							/*水平方向不可移动*/
							x = clipRectX;
						}		
						
						if(fix.height > rectWidth){
							/*垂直方向可移动*/
							if(fix.y + distanceY >= clipRectY - (fix.height - rectWidth) && fix.y + distanceY <= clipRectY){
								y = fix.y + distanceY;
							}else{
								if(fix.y + distanceY < clipRectY - (fix.height - rectWidth)){
									y = clipRectY - (fix.height - rectWidth);
								}else if(fix.y + distanceY > clipRectY){
									y = clipRectY;
								}
							}						
						}else{
							/*垂直方向不可移动*/
							y = clipRectY;
						}
						fix.x = x;
						fix.y = y;
					});
					
					
					/*缩放监听*/
					touch.on('#clip', 'pinch', function(ev){
						var x1, y1,
								x2, y2,
								x3, y3;
								
						if(fix.width * ev.scale > ret.width){
							scaleWidth = fix.width * ev.scale;
						}else{
							scaleWidth = ret.width;
						}
						
						if(fix.height * ev.scale > ret.height){
							scaleHeight = fix.height * ev.scale;
						}else{
							scaleHeight = ret.height;
						}
						
						x1 = fix.x - (scaleWidth - fix.width) / 2;
						y1 = fix.y - (scaleHeight - fix.height) / 2;
						
						x2 = fix.x - (scaleWidth - fix.width);
						y2 = fix.y - (scaleHeight - fix.height);
						
						x3 = clipRectX;
						y3 = clipRectY;
						
						if(x1 < clipRectX && x1 + scaleWidth > clipRectX + rectWidth){
							scaleX = x1;
						}else if(x1 < clipRectX && x1 + scaleWidth <= clipRectX + rectWidth){
							scaleX = x2 - (fix.width - (clipRectX - fix.x) - rectWidth) ;
						}else if(x1 >= clipRectX && x1 + scaleWidth > clipRectX + rectWidth){
							scaleX = x3;
						}else if(x1 >= clipRectX && x1 + scaleWidth <= clipRectX + rectWidth){
							scaleX = x3;
						}
						
						if(y1 < clipRectY && y1 + scaleHeight > clipRectY + rectWidth){
							scaleY = y1;
						}else if(y1 < clipRectY && y1 + scaleHeight <= clipRectY + rectWidth){
							scaleY = y2 - (fix.height - (clipRectY - fix.y) - rectWidth);
						}else if(y1 >= clipRectY && y1 + scaleHeight > clipRectY + rectWidth){
							scaleY = y3;
						}else if(y1 >= clipRectY && y1 + scaleHeight <= clipRectY + rectWidth){
							scaleY = y3;
						}
						
						imgCxt.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
						imgCxt.drawImage(img, scaleX, scaleY, scaleWidth, scaleHeight);					
					});					
					
					touch.on('#clip', 'pinchend', function(ev){
						fix.x = scaleX;
						fix.y = scaleY;
						fix.width = scaleWidth;
						fix.height = scaleHeight;		
					});
					
					try{
						api.addEventListener({
							name: 'clipImage'
						}, function(ret, err){
							var _cav = document.createElement('canvas'),
									_cxt = _cav.getContext('2d');
							
							/*截图的大小为手机屏幕的两倍*/
							var a = (clipRectX - fix.x) / fix.width,
									b = (clipRectY - fix.y) / fix.height;
									
							_cav.width = _cav.height = rectWidth * 2;
							_cxt.drawImage(img, -(fix.width * 2 * a), -(fix.height * 2 * b), fix.width * 2, fix.height * 2);
//							_cav.width = _cav.height = rectWidth;
//							_cxt.drawImage(img, -(clipRectX - fix.x), -(clipRectY - fix.y), fix.width, fix.height);
							
							self.strToImg(_cav.toDataURL('image/png'), function(imgSrc){
								api.sendEvent({
									name: args.callbackEvent,
									extra: {
										url: imgSrc
									}
								});
								api.closeWin();
							});
						});	
					}catch(e){
						
					}
					
				});
			}
		},
		positionCenter: function(args, callback){
			/*图片等比例拉伸，居中显示
			 * @args 数据结构
			 * imgWidth
			 * imgHeight
			 * modelWidth 模型宽度
			 * modelHeight 模型高度
			 * @return
			 * x 在画布上放置图像的 x 坐标位置
			 * y 在画布上放置图像的 y 坐标位置
			 * width 要使用的图像的宽度。（伸展或缩小图像）
			 * height 要使用的图像的宽度。（伸展或缩小图像）
			 * direction 可拖拉的方向: h-水平、v-垂直
			 */
			var percentage = args.modelWidth / args.modelHeight, 
					x, y, sx, sy, width, height, ret;
			
			if(args.imgWidth / args.imgHeight > args.modelWidth / args.modelHeight){
				/*图片的宽高比大于模型的宽高比
				 * 以图片的高度度为准(高度设置为刚好等于截图区域)，等比例缩放图片宽度
				 */
				percentage = args.modelHeight / args.imgHeight;
				width = args.imgWidth * percentage;
				height = args.modelHeight;
				x = (window.innerWidth - args.modelWidth) / 2 - (width - args.modelWidth) / 2;
				y = (window.innerHeight - args.modelWidth) / 2;
				
				direction = 'h';
			}else{
				/*图片的宽高比小于等于模型的宽高比
				 * 以图片的宽度为准(宽度设置为刚好等于截图区域)，等比例截取图片高度
				 */		
				percentage = args.modelWidth / args.imgWidth;
				width = args.modelWidth;
				height = args.imgHeight * percentage;
				x = (window.innerWidth - args.modelWidth) / 2;
				y = (window.innerHeight - args.modelHeight) / 2 - (height - args.modelHeight) / 2;
				direction = 'v';
			}
			if(typeof callback === 'function'){
				callback({
					x: x,
					y: y,
					width: width,
					height: height,
					direction: direction
				});
			}					
		},
		strToImg: function(base64Str, callback){
			api.showProgress({
				title: '图片截取中...'
			});
      var obj = api.require('trans'),
      		imgPath = api.fsDir + '/',
      		test = 0,
      		imgName = 'avatar_'+new Date().getTime() + '.png';
      obj.saveImage({
        base64Str: base64Str.replace(/data:image\/png;base64,/, ''),
        album: false,
        imgPath: api.fsDir,
        imgName: imgName
      }, function(ret, err){
        if(ret.status) {
        	if(test++ != 0){
        		/*若回调被重复执行，则马上拦截*/
        		return;
        	}
        	api.hideProgress();
        	if(typeof callback){
        		callback(imgPath + imgName);
        	}
        }else{
        	if(err && err.msg){
        		toast(err.msg);
        	}
        }
      });
		}
	};

	window.imageClip = ic;
}(window);
