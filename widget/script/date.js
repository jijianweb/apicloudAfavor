/*
 * 时间工具函数
 * 封装于 2015-07-07
 */
(function(window){
	var d = {};
	d.t1 = function(pts, flag){
		/*
		*参数
		* string/number pts 过去的时间戳
		* boolean flag: '我的消息'一周之外只显示：月/日
		*/
		pts = this.formatTS(pts);
		var now = new Date(),
				nts = now.getTime(),
				pass = new Date(pts);
		/*是否在三天内：今天、昨天、前天*/
		var isT = this.isT(pts, now);
		if(isT){
			return isT;
		}
		/*是否在这一周内*/
		var isInWeek = this.isInWeek(pts, now);
		if(isInWeek){
			return isInWeek;
		}
		/*超出一周范围*/
		var moment,
				hours = pass.getHours();
		if(hours>=0 && hours<6){
			moment = 'AM ';
		}else if(hours>=6 && hours<12){
			moment = 'AM ';
		}else if(hours == 12){
			moment = 'PM ';
		}else if(hours>12 && hours<18){
			moment = 'PM ';
		}else{
			moment = 'PM ';
		}
		if(flag){
			// return (pass.getMonth()+1) + '月' + pass.getDate() + '日';
			return d.monthEN(pass.getMonth()+1) + ' ' + pass.getDate();
		}else{
			return d.monthEN(pass.getMonth()+1) + ' ' + pass.getDate() + ', ' + moment + (pass.getHours()>9?pass.getHours():'0'+pass.getHours()) + ':' + (pass.getMinutes()>9?pass.getMinutes():'0'+pass.getMinutes());
		}
	};

	d.monthEN = function(month){
		/*
		 * 获取英文格式的月份名称
		 */
		
		switch(month){
			case 1:
				return 'January';
			case 2:
				return 'February';
			case 3:
				return 'March';
			case 4:
				return 'April';
			case 5:
				return 'May';
			case 6:
				return 'June';
			case 7:
				return 'July';
			case 8:
				return 'August';
			case 9:
				return 'September';
			case 10:
				return 'October';
			case 11:
				return 'November';
			case 12:
				return 'December';
		}
	};

	d.t2 = function(ts){
		/*仿微信朋友圈列表发布时间
		 * ts 发布时间戳
		 */
		ts = this.formatTS(ts);
		var now = new Date(),
				nts = now.getTime(),
				pts = nts - ts; //时间差

		if(pts < 1000*60*60){
			return parseInt(pts / 1000 / 60) + 'second ago';
		}else if(pts < 1000*60*60*24){
			return parseInt(pts / 1000 / 60 / 60) + 'hour ago';
		}else{
			return parseInt(pts / 1000 / 60 / 60 / 24) + 'day ago';
		}
	};
	d.t3 = function(ts){
		/*仿微信朋友圈-帖子详情内的发布时间
		 * ts 发布时间戳
		 */
		ts = this.formatTS(ts);
		var now = new Date(),
				nts = now.getTime(),
				pass = new Date(ts),
				pyear = pass.getFullYear(),
				phour = pass.getHours(),
				pminute = pass.getMinutes(),
				psecond = pass.getSeconds(),
				pts = nts - ts; //时间差
		pminute = pminute > 9 ? pminute : '0' + pminute;
		if(nts > pts && nts < pts+(24-phour)*60*60*1000+(60-pminute)*60*1000+(60-psecond)*1000){
			//今天发布的
			return phour + ':' + pminute;
		}else if(now.getFullYear() == pyear){
			//今年发布
			return d.monthEN(pass.getMonth() + 1) + ' ' + pass.getDate() + ', ' + phour + ':' + pminute;
		}else{
			//更久以前发布
			return d.monthEN(pass.getMonth() + 1) + ' ' + pass.getDate() + ', ' + pyear + ' ' + phour + ':' + pminute;
		}
	};
	d.formatTS = function(ts){
		/*若时间戳为字符串则转型*/
		if('string' === typeof st){
			ts = parseInt(ts);
		}
		/*由于PHP返回的时间戳为10位，不足13位则补充*/
		if(ts.toString().length < 13){
			ts *= 1000;
		}
		return ts;
	};
	/*时间格式化f系列方法*/
	d.f1 = function(t, flag){
		var t = new Date(parseInt(t)*1000);
		return t.getFullYear() + flag + (t.getMonth()+1) + flag + t.getDate();
	};
	d.isT = function(pts, now){
		/*是否在三天内：今天、昨天、前天*/
		/*pts为过去时间戳，now为现在的日期对象*/
		pts = this.formatTS(pts);
		var	nts = now.getTime(),
				pass = new Date(pts);
		if((nts-(now.getHours()+24*2)*60*60*1000-now.getMinutes()*60*1000-now.getSeconds()*1000) <= pts){
			var moment, d, str,
				hours = pass.getHours();
			/*三天内*/
			if(now.getDate() == pass.getDate()){
				/*今天*/
				d = "Today ";

			}else if((nts-(now.getHours()+24)*60*60*1000-now.getMinutes()*60*1000-now.getSeconds()*1000) <= pts){
				/*昨天*/
				d = 'Yesterday ';
			}else if((nts-(now.getHours()+24*2)*60*60*1000-now.getMinutes()*60*1000-now.getSeconds()*1000) <= pts){
				/*前天*/
//				moment = '前天 ';
			}

			if(hours>=0 && hours<6){
				moment = 'AM';	//凌晨
			}else if(hours>=6 && hours<12){
				moment = 'AM';	//上午
			}else if(hours == 12){
				moment = 'PM';	//中午
			}else if(hours>12 && hours<18){
				moment = 'PM';	//下午
			}else{
				moment = 'PM';	//晚上
			}

			str = (d||(pass.getMonth()+1)+'月'+pass.getDate()+'日 ') + (pass.getHours()>9?pass.getHours():'0'+pass.getHours()) + ':' + (pass.getMinutes()>9?pass.getMinutes():'0'+pass.getMinutes());
			return str + ' ' + moment;
		}
		return false;
	};
	d.isInWeek = function(pts, now){
		/*是否在这一周内*/
		/*pts为过去时间戳，now为现在的日期对象*/
		var x = now.getDay(),	/*今天星期几*/
				nts = now.getTime(),
				pass = new Date(pts);
		if(x > 3){
			if(nts-(now.getHours()+24*(x==0?6:x))*60*60*1000-now.getMinutes()*60*1000-now.getSeconds()*1000 <= pts){
				var weekDay;
				switch(pass.getDay()){
					case 0:
						weekDay = 'Sunday';
						break;
					case 1:
						weekDay = 'Monday';
						break;
					case 2:
						weekDay = 'Tuesday';
						break;
					case 3:
						weekDay = 'Wednesday';
						break;
					case 4:
						weekDay = 'Thursday';
						break;
					case 5:
						weekDay = 'Friday';
						break;
					case 6:
						weekDay = 'Saturday';
						break;
				}
				return weekDay + ' ' + (pass.getHours()>9?pass.getHours():'0'+pass.getHours()) + ':' + (pass.getMinutes()>9?pass.getMinutes():'0'+pass.getMinutes());
			}
		}
		return false;
	};

	d.formatNum = function(num){
		return num > 9 ? num : '0' + num;
	};

	d.f2 = function(ts, flag){
		var t = new Date(ts);
		return t.getFullYear() + flag + (d.formatNum(t.getMonth()+1)) + flag + d.formatNum(t.getDate());
	};

	window.D = d;
})(window);
