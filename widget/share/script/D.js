/*
 * 时间工具函数
 * 封装于 2015-07-07
 */
(function(window) {
	var d = {};
	d.t1 = function(pts, flag) {
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
		if(isT) {
			return isT;
		}
		/*是否在这一周内*/
		var isInWeek = this.isInWeek(pts, now);
		if(isInWeek) {
			return isInWeek;
		}
		/*超出一周范围*/
		var moment,
			hours = pass.getHours();
		if(hours >= 0 && hours < 6) {
			moment = '凌晨 ';
		} else if(hours >= 6 && hours < 12) {
			moment = '上午 ';
		} else if(hours == 12) {
			moment = '中午 ';
		} else if(hours > 12 && hours < 18) {
			moment = '下午 ';
		} else {
			moment = '晚上 ';
		}
		if(flag) {
			return(pass.getMonth() + 1) + '月' + pass.getDate() + '日';
		} else {
			return(pass.getMonth() + 1) + '月' + pass.getDate() + '日 ' + moment + (pass.getHours() > 9 ? pass.getHours() : '0' + pass.getHours()) + ':' + (pass.getMinutes() > 9 ? pass.getMinutes() : '0' + pass.getMinutes());
		}
	};
	d.t2 = function(ts) {
		/*仿微信朋友圈列表发布时间
		 * ts 发布时间戳
		 */
		ts = this.formatTS(ts);
		var now = new Date(),
			nts = now.getTime(),
			pts = nts - ts; //时间差

		if(pts < 1000 * 60) {
			return '刚刚';
		} else if(pts < 1000 * 60 * 60) {
			return parseInt(pts / 1000 / 60) + '分钟前';
		} else if(pts < 1000 * 60 * 60 * 24) {
			return parseInt(pts / 1000 / 60 / 60) + '小时前';
		} else {
			return parseInt(pts / 1000 / 60 / 60 / 24) + '天前';
		}
	};
	d.favors = function(ts) {
		/*favors专用时间戳
		 * ts 发布时间戳
		 *
		 */
		//parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
		ts = ts.toString();
		if(ts.length == 10) {
			/*PHP返回的时间戳长度为10，JS要求的长度必须13
			 * 若长度不足，则以0补充
			 */
			ts = parseInt(ts) * 1000;
		}
		ts = parseInt(ts);
		var now = new Date().getTime();
		var now_obj = Tool.parseDate(now);
		var ts_obj = Tool.parseDate(ts);
		var year = now_obj.year - ts_obj.year,
			month = now_obj.month - ts_obj.month,
			day = now_obj.date - ts_obj.date,
			hour = now_obj.year - ts_obj.year,
			minute = now_obj.minute - ts_obj.minute,
			second = now_obj.second - ts_obj.second,
			result = '';
		if(year >= 1) result = parseInt(year) + "y";
		else if(month >= 1) result = parseInt(month) + "m";
		else if(day >= 1) result = parseInt(day) + "d";
		else if(hour >= 1) result = parseInt(hour) + "h";
		else if(minute >= 1) result = parseInt(minute) + "min";
		else result = second + " s";
		return result;
	};
	d.favors2 = function(ts) {
		/*favors专用时间戳
		 * ts 发布时间戳
		 *
		 */
		//parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
		ts = ts.toString();
		if(ts.length == 10) {
			/*PHP返回的时间戳长度为10，JS要求的长度必须13
			 * 若长度不足，则以0补充
			 */
			ts = parseInt(ts) * 1000;
		}
		ts = parseInt(ts);
		var now = new Date().getTime();
		var now_obj = Tool.parseDate(now);
		var ts_obj = Tool.parseDate(ts);
		var year = now_obj.year - ts_obj.year,
			month = now_obj.month - ts_obj.month,
			day = now_obj.date - ts_obj.date,
			hour = now_obj.year - ts_obj.year,
			minute = now_obj.minute - ts_obj.minute,
			second = now_obj.second - ts_obj.second,
			result = '';
		if(year== 1 && year>0){
		    result = parseInt(year) + "year ago";
		}else if(year > 1 && year>0){
			result = parseInt(year) + "years ago";
		}else if(month== 1 && month>0){
			result = parseInt(month) + "month ago";
		}else if(month > 1 && month>0){
			result = parseInt(month) + "months ago";
		}else if(day == 1 && day>0){
			result = parseInt(day) + "day ago";
		}else if(day > 1 && day>0){
			result = parseInt(day) + "days ago";
		}else if(hour == 1 && hour>0){
			result = parseInt(hour) + "hour ago";
		}else if(hour >1 && hour>0){
			result = parseInt(hour) + "hours ago";
		}else if(minute == 1 && minute>0){
			result = parseInt(minute) + "minute ago";
		}else if(minute >1 && minute>0){
			result = parseInt(minute) + "minutes ago";
		}else if(second==1 && second>0){
			result = second + "second ago";
		}else if(second>=1 && second>0){
			result = second + "seconds ago";
		}
		return result;
	};
	d.t3 = function(ts) {
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
		if(nts > pts && nts < pts + (24 - phour) * 60 * 60 * 1000 + (60 - pminute) * 60 * 1000 + (60 - psecond) * 1000) {
			//今天发布的
			return phour + ':' + pminute;
		} else if(now.getFullYear() == pyear) {
			//今年发布
			return(pass.getMonth() + 1) + '月' + pass.getDate() + '日  ' + phour + ':' + pminute;
		} else {
			//更久以前发布
			return pyear + '年' + (pass.getMonth() + 1) + '月' + pass.getDate() + '日  ' + phour + ':' + pminute;
		}
	};
	d.formatTS = function(ts) {
		/*若时间戳为字符串则转型*/
		if('string' === typeof st) {
			ts = parseInt(ts);
		}
		/*由于PHP返回的时间戳为10位，不足13位则补充*/
		if(ts.toString().length < 13) {
			ts *= 1000;
		}
		return ts;
	};
	/*时间格式化f系列方法*/
	d.f1 = function(t, flag) {
		var t = new Date(parseInt(t) * 1000);
		return t.getFullYear() + flag + (t.getMonth() + 1) + flag + t.getDate();
	};
	d.isT = function(pts, now) {
		/*是否在三天内：今天、昨天、前天*/
		/*pts为过去时间戳，now为现在的日期对象*/
		pts = this.formatTS(pts);
		var nts = now.getTime(),
			pass = new Date(pts);
		if((nts - (now.getHours() + 24 * 2) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000) <= pts) {
			var moment;
			/*三天内*/
			if(now.getDate() == pass.getDate()) {
				/*今天*/
				var hours = pass.getHours();
				if(hours >= 0 && hours < 6) {
					moment = '凌晨 ';
				} else if(hours >= 6 && hours < 12) {
					moment = '上午 ';
				} else if(hours == 12) {
					moment = '中午 ';
				} else if(hours > 12 && hours < 18) {
					moment = '下午 ';
				} else {
					moment = '晚上 ';
				}
			} else if((nts - (now.getHours() + 24) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000) <= pts) {
				/*昨天*/
				moment = '昨天 ';
			} else if((nts - (now.getHours() + 24 * 2) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000) <= pts) {
				/*前天*/
				moment = '前天 ';
			}
			return(moment || (pass.getMonth() + 1) + '月' + pass.getDate() + '日 ') + (pass.getHours() > 9 ? pass.getHours() : '0' + pass.getHours()) + ':' + (pass.getMinutes() > 9 ? pass.getMinutes() : '0' + pass.getMinutes());
		}
		return false;
	};
	d.isInWeek = function(pts, now) {
		/*是否在这一周内*/
		/*pts为过去时间戳，now为现在的日期对象*/
		var x = now.getDay(),
			/*今天星期几*/
			nts = now.getTime(),
			pass = new Date(pts);
		if(x > 3) {
			if(nts - (now.getHours() + 24 * (x == 0 ? 6 : x)) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000 <= pts) {
				var weekDay;
				switch(pass.getDay()) {
					case 0:
						weekDay = '周日';
						break;
					case 1:
						weekDay = '周一';
						break;
					case 2:
						weekDay = '周二';
						break;
					case 3:
						weekDay = '周三';
						break;
					case 4:
						weekDay = '周四';
						break;
					case 5:
						weekDay = '周五';
						break;
					case 6:
						weekDay = '周六';
						break;
				}
				return weekDay + ' ' + (pass.getHours() > 9 ? pass.getHours() : '0' + pass.getHours()) + ':' + (pass.getMinutes() > 9 ? pass.getMinutes() : '0' + pass.getMinutes());
			}
		}
		return false;
	};

	window.D = d;
})(window);