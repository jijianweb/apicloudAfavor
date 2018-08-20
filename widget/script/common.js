/**
 * app/微信 框架配置文件
 * 创建：2015-11-9
 * 更新：2016-8-30 : 以常量命名规范 代替 变量命名规范
 */

! function(window) {
	//项目名称，组成异步地址、分享地址的一部分
	window.PROJECT_NAME = 'afavor';
	//是否为正式(生产)环境
	window.IS_FORMAL_ENV = false;

	//域名	http://18.220.211.84:8888		http://afavor.ca
	window.DOMAIN = IS_FORMAL_ENV ? 'http://afavor.ca' : 'http://afavor.jjweb.org';
		// 'http://testafavor.milianjie.com';
	window.QINIU_DOMAIN = IS_FORMAL_ENV ? '' :
		'';

	window.CONFIG = {
		VERSION: '1.0.0', //app上架版本号，是组成本地数据库文件的名称的一部分
		DEBUG: IS_FORMAL_ENV ? false : true,
		/*本地数据库配置，用于缓存数据结构*/
		DB: {
			NAME: PROJECT_NAME, //数据库名称，一般默认为 PROJECT_NAME
			MAIN_TABLE: 'mainTable',
			/*主表*/
			DEBUG: IS_FORMAL_ENV ? false : true /*是否启动本地数据库调试机制，true则显示报错弹出框*/
		},
		MEMBER_INFO_API: { //memberInfo接口控制器
			CTRL: 'Mine',
			FN: 'memberinfo'
		},
		GET_RONG_TOKEN_API: { //获取融云token接口
			CTRL: 'Common',
			FN: 'getRongCloudToken'
		},
		GOOGLE: {
			KEY: 'AIzaSyBo_6AP5aDE4D_SbxcAneGMtYEpgtW1wDw' //google JS-SDK地图 Key
		},
		SHARE_URL: DOMAIN + '/AppShare',
		/*异步请求配置，用于获取服务器端数据*/
		AJAX: {
			BASE_URL: DOMAIN + '/index.php/api'
		},
		APP_PURCHASE: { //苹果内购
			PRODUCT_IDS: []
		},
		AJ_PUSH: IS_FORMAL_ENV ? false : true,
		IS_SHOW_NOTIFY: false,	//IOS, 收到推送消息后，是否在状态栏弹出
		/*是否绑定极光推送测试*/
		KEY: { //预设键名，用于数据缓存
			USER_NAME: 'username', //键名：用户名
			MEMBER_INFO: 'memberinfo', //键名：用户信息
			MEMBER_ID: 'id', //键名：用户id
			TOKEN: 'token', //键名：用户token
			APP_VERSION: 'appVersion', //键名：app编译版本号
			FIRST_OPEN: 'firstOpen', //键名：是否第一次打开app
			LON: 'lon', //键名：用户定位-经度
			LAT: 'lat', //键名：用户定位-纬度
			RELOGIN_EVENT: 'relogin', //退出登录事件
			LOCAL_SHARE_LOGO: '//image/logo.png', //本地分享图标ICON路径
			SHARE_LOGO: '', //线上分享图标ICON路径
			LANGUAGE: 'language',
			CURRENCY: 'currency',
			FIRSTNAMEANDLASTNAME: 'fullName',	//用户全名
			MEIQIA: {
				APPKEY: ''
			},
		}
	};
	//	$api.setStorage('lat',CONFIG.KEY.LAT);
	//	alert(CONFIG.KEY.LAT)
	//	$api.setStorage('lon',CONFIG.KEY.LON);
}(window);

/*调试模块
 *
 */
! function(window) {
	var d = {
		alt: function(msg) {
			if(CONFIG.DEBUG) {
				api.alert({
					title: '提示信息',
					msg: msg,
				});
			}
		},
		toast: function(msg) {
			if(CONFIG.DEBUG) {
				api.toast({
					location: 'top',
					msg: msg
				});
			}
		}
	};
	window.Debug = d;
}(window);

/*
 * 模板拼接，必须先导入doT.js
 * 创建于2016-1-10
 */
! function(window) {
	var t = {
		html: function(selector, template, data) {
			$api.html($api.dom(selector), doT.template($api.html($api.dom('[template="' + template + '"]')))(data || ''));
			try {
				api.parseTapmode();
			} catch(e) {

			}
		},
		append: function(selector, template, data) {
			$api.append($api.dom(selector), doT.template($api.html($api.dom('[template="' + template + '"]')))(data || ''));
			try {
				api.parseTapmode();
			} catch(e) {

			}
		},
		prepend: function(selector, template, data) {
			$api.prepend($api.dom(selector), doT.template($api.html($api.dom('[template="' + template + '"]')))(data || ''));
			try {
				api.parseTapmode();
			} catch(e) {

			}
		},
		before: function(selector, template, data) {
			$api.before($api.dom(selector), doT.template($api.html($api.dom('[template="' + template + '"]')))(data || ''));
			try {
				api.parseTapmode();
			} catch(e) {

			}
		},
		after: function(selector, template, data) {
			$api.after($api.dom(selector), doT.template($api.html($api.dom('[template="' + template + '"]')))(data || ''));
			try {
				api.parseTapmode();
			} catch(e) {

			}
		},
	};
	window.T = t;
}(window);

/*
 * 创建于2015-05-23
 * DB模块封装了手机常用数据库sqlite的增删改查语句
 * 可实现数据的本地存储，极大的简化了数据归档问题
 *--------------------------------------------------
 * 更新于：2016-07-27	23:04
 */
(function(window) {
	var d = {
		init: function(args) {
			/**
			 * 打开本地数据库
			 * @param  	{string} 		name			数据库名称，统一使用[CONFIG.DB.NAME]
			 * @param		{string}		path			数据库所在路径，不传时使用默认创建的路径。
			 *                         				支持 fs://、widget://等协议（如fs://user.db）
			 *                         				统一使用['fs://db/'+ CONFIG.DB.NAME +'.db']
			 * @param		{function}	success		初始化完毕后的回调
			 */
			var db = api.require('db'),
				self = this;

			db.openDatabase({
				name: args ? args.name || CONFIG.DB.NAME : CONFIG.DB.NAME,
				path: 'fs://db/' + CONFIG.DB.NAME + '_' + CONFIG.VERSION + '.db'
			}, function(ret, err) {
				if(ret.status) {
					/*数据库	 打开/创建  成功
					 * 创建主表
					 */
					self.createTable({
						table: CONFIG.DB.MAIN_TABLE,
						field: [
							'`key` varchar(100)',
							'`value` text'
						],
						success: function() {
							if(args && 'function' === typeof args.success) {
								args.success();
							}
						}
					});
				} else {
					if(CONFIG.DEBUG && CONFIG.DB.DEBUG) {
						var msg;
						if(err.msg) {
							msg = err.msg;
						} else {
							msg = 'open database error';
						}
						api.alert({
							title: 'openDatabase提示信息',
							msg: msg
						});
					}
				}
			});
		},

		closeDatabase: function(args) {
			/**
			 * 关闭数据库
			 * @param		{string}			name				数据库名称，统一使用[CONFIG.DB.NAME]
			 * @param		{function}		success			成功的回调
			 */
			var db = api.require('db'),
				self = this;

			db.closeDatabase({
				name: args ? args.name || CONFIG.DB.NAME : CONFIG.DB.NAME
			}, function(ret, err) {
				if(ret.status) {
					if(typeof args.success === 'function') {
						args.success();
					}
				} else {
					if(CONFIG.DEBUG && CONFIG.DB.DEBUG) {
						api.alert({
							title: 'closeDatabase提示信息',
							msg: err.msg
						});
					}
				}
			});
		},

		createTable: function(args) {
			/**
			 * 创建数据表
			 * @param		{string}			table				表名，统一使用[CONFIG.DB.MAIN_TABLE]
			 * @param		{array}				field				数据表的字段
			 * @param		{function}		success			成功的回调
			 */
			var self = this,
				sql = 'create table if not exists ' + args.table + '(' + args.field.join() + ')';
			this.executeSql({
				sql: sql,
				success: function() {
					if('function' === typeof args.success) {
						args.success();
					}
				}
			});
		},

		executeSql: function(args) {
			/**
			 * 执行 sql
			 * @param		{string}			dbName			数据库名，统一使用[CONFIG.DB.NAME]
			 * @param		{string}			sql					SQL语句
			 * @param		{function}		success			成功的回调
			 */
			var db = api.require('db');
			db.executeSql({
				name: args.dbName || CONFIG.DB.NAME,
				sql: args.sql
			}, function(ret, err) {
				// alert('executeSql:'+$api.jsonToStr(ret||err));
				if(ret.status) {
					/*执行SQL成功*/
					if('function' === typeof args.success) {
						args.success();
					}
				} else {
					/*执行SQL失败*/
					if(CONFIG.DEBUG && CONFIG.DB.DEBUG) {
						var msg;
						if(err.msg) {
							msg = err.msg;
						} else {
							msg = 'execute sql error';
						}
						api.alert({
							title: 'executeSQL提示信息',
							msg: msg
						});
					}
				}
			});
		},

		selectSql: function(args) {
			/**
			 * 执行查询sql命令
			 *
			 * @param		{string}		dbName		数据库名，统一使用[CONFIG.DB.NAME]
			 * @param		{string}		sql				查询SQL语句
			 * @param		{function}	success		成功回调
			 * success
			 * @return	{array}			data			查询结果数据
			 *
			 */
			var db = api.require('db');
			db.selectSql({
				name: args.dbName || CONFIG.DB.NAME,
				sql: args.sql
			}, function(ret, err) {
				if(ret.status) {
					/*查询sql成功*/
					if('function' === typeof args.success) {
						/*ret.data为查询结果(array)*/
						args.success(ret.data);
					}
				} else {
					/*查询sql失败*/
					if(CONFIG.DEBUG && CONFIG.DB.DEBUG) {
						var msg;
						if(err.msg) {
							msg = err.msg;
						} else {
							msg = 'select sql error';
						}
						api.alert({
							title: 'selectSQL提示信息',
							msg: msg
						});
					}
				}
			});
		},

		setValue: function(args) {
			/**
			 * 缓存指定接口的数据到本地
			 * 根据指定key值获取value，每个key值由ctrl与fn组成，即对应一个接口，
			 * 所以，value的值就是该接口的缓存数据
			 *
			 * @param		{string}		key			键名
			 * @param		{string}		value		键值
			 * @param		{number}		flag		根据此值执行insert(0)或update(1)操作
			 * @param		{function}	success	成功的回调
			 *
			 */
			var self = this,
				updateSql = 'update ' + CONFIG.DB.MAIN_TABLE + " set value='" + args.value + "' where key='" + args.key + "'";

			if(args.flag) {
				this.executeSql({
					sql: updateSql,
					success: args.success
				});
			} else {
				this.insert({
					data: {
						key: args.key,
						value: args.value
					}
				}, args.success);
			}
		},

		getValue: function(args) {
			/**
			 * 获取对应接口的缓存数据
			 * 根据指定key值获取value，每个key值由ctrl与fn组成，即对应一个接口，
			 * 所以，value的值就是该接口的缓存数据
			 *
			 * @param		{string}			key				键名
			 * @param 	{function}		success		成功回调
			 *
			 * @return	{string}			value			对应键名的键值
			 */

			var self = this,
				sql = 'select * from ' + CONFIG.DB.MAIN_TABLE + ' where key="' + args.key + '"';
			this.selectSql({
				sql: sql,
				success: function(data) {
					if(typeof args.success === 'function') {
						if(data.length > 0) {
							args.success(data[0].value);
						} else {
							//返回空，只为更方便调用者判断
							args.success('');
						}
					}
				}
			});
		},

		insert: function(args) {
			/**
			 * 数据插入
			 *
			 * @param		{string}		table			数据主表的名称，统一使用[CONFIG.DB.MAIN_TABLE]
			 * @param		{object}		data			将被插入数据表的数据，即接口返回的新数据将初次插入数据表
			 * @param		{function}	success		成功的回调
			 */
			var sql = 'insert into ' + (args.table || CONFIG.DB.MAIN_TABLE) + ' (' +
				(function() {
					var k = '',
						t;
					for(var key in args.data) {
						k = k + key + ',';
					}
					t = k.slice(0, -1);
					return t;
				})() + ')' + ' values(' +
				(function() {
					var v = '';
					for(var key in args.data) {
						v = v + "'" + args.data[key] + "',";
					}
					return v.slice(0, -1);
				})() + ')';
			this.executeSql({
				sql: sql,
				success: args.success
			});
		}

	};
	/*事务*/
	d.transaction = function(dbName, operation, callback) {
		var db = api.require('db');
		db.transaction({
			name: dbName,
			operation: operation
		}, function(ret, err) {
			if(ret.status) {
				/*事务操作成功*/
				if('function' === typeof callback) {
					callback();
				}
			} else {
				/*事务操作失败*/
				if(CONFIG.DB.DEBUG) {
					var msg;
					if(err.msg) {
						msg = err.msg;
					} else {
						msg = 'transaction operation error';
					}
					api.alert({
						title: '提示信息',
						msg: msg
					});
				}
			}
		});
	};
	window.DB = d;
})(window);

/*表单字段验证
 * 创建于2016-1-27
 */

! function(window) {
	var f = {
		isPhone: function(val) {
			if(val && /^1[3,5,7,8]\d{9}$/.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		isEmail: function(val) {
			var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if(val && reg.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		validateNickname: function(nickname) {
			if(nickname) {
				if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(nickname)) {
					Tool.toast('昵称不能含有特殊字符~');
					return false;
				}
			} else {
				Tool.toast('请填写您的昵称~');
				return false;
			}
			return true;
		},
		validateRealname: function(value) {
			if(value) {
				if(!/^[\u4E00-\u9FA5A-Za-z]+$/.test(value)) {
					Tool.toast('真实姓名不能含有数字、特殊字符~');
					return false;
				}
			} else {
				Tool.toast('请填写您的真实姓名~');
				return false;
			}
			return true;
		},
		validatePhone: function(phone) {
			//验证手机号码合法性
			if(phone) {
				if(!/^1[3,4,5,7,8]\d{9}$/.test(phone)) {
					Tool.toast('手机号码不正确~');
					return false;
				}
			} else {
				Tool.toast('请填写您的手机号码~');
				return false;
			}
			return true;
		},
		validateEmail: function(email) {
			//验证邮箱合法性
			if(email) {
				if(!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
					//					Tool.toast('邮箱地址不正确~');
					return false;
				}
			} else {
				//				Tool.toast('请填写您的邮箱地址~');
				return false;
			}
			return true;
		},
		validatePassword: function(password) {
			//验证密码合法性
			if(!password) {
				Tool.toast("Please enter your account's password");
				return false;
			} else if(password.length < 6) {
				Tool.toast('password length must be over 6 numbers including letters.');
				return false;
			} else if(password.indexOf(' ') > -1) {
				Tool.toast("Please enter your account's password");
				return false;
			}
			return true;
		},
		is_define: function(value) {
			if(value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
				return false;
			} else {
				value = value + "";
				value = value.replace(/\s/g, "");
				if(value == "") {
					return false;
				}
				return true;
			}
		}
	};

	window.Former = f;
}(window);

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
			moment = 'am '; //凌晨
		} else if(hours >= 6 && hours < 12) {
			moment = 'am '; //上午
		} else if(hours == 12) {
			moment = 'pm '; //中午
		} else if(hours > 12 && hours < 18) {
			moment = 'pm '; //下午
		} else {
			moment = 'pm '; //晚上
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
		var second = parseInt((now - ts) / 1000);
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var diffValue = now - ts;
		if(diffValue < 0) { return; }
		var year = diffValue / month / 12;
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		if(year >= 1) {
			result = parseInt(year) + " y";
		} else if(monthC >= 1) {
			result = parseInt(monthC) + " m";
		} else if(dayC >= 1) {
			result = parseInt(dayC) + " d";
		} else if(hourC >= 1) {
			result = parseInt(hourC) + " h";
		} else if(minC >= 1) {
			result = parseInt(minC) + " min";
		} else if(second == 0) {
			result = "1 s";
		} else
			result = parseInt(second) + " s";
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
		var second = parseInt((now - ts) / 1000);
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var diffValue = now - ts;
		if(diffValue < 0) { return; }
		var year = diffValue / month / 12;
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;

		if(parseInt(year) == 1) {
			result = parseInt(year) + " year ago";
		} else if(year > 1) {
			result = parseInt(year) + " years ago";
		} else if(parseInt(monthC) == 1) {
			result = parseInt(monthC) + " month ago";
		} else if(monthC > 1) {
			result = parseInt(monthC) + " months ago";
		} else if(parseInt(dayC) == 1) {
			result = parseInt(dayC) + " day ago";
		} else if(dayC > 1) {
			result = parseInt(dayC) + " days ago";
		} else if(parseInt(hourC) == 1) {
			result = parseInt(hourC) + " hour ago";
		} else if(hourC > 1) {
			result = parseInt(hourC) + " hours ago";
		} else if(parseInt(minC) == 1) {
			result = parseInt(minC) + " minute ago";
		} else if(minC > 1) {
			result = parseInt(minC) + " minutes ago";
		} else if(second == 1) {
			result = second + " second ago";
		} else if(second >= 1) {
			result = second + " seconds ago";
		} else if(year < 0 || month < 0 || day < 0 || hour < 0 || minute < 0 || second < 0) {
			return result = Math.abs(result);
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
					moment = 'am ';
				} else if(hours >= 6 && hours < 12) {
					moment = 'am ';
				} else if(hours == 12) {
					moment = 'pm ';
				} else if(hours > 12 && hours < 18) {
					moment = 'pm ';
				} else {
					moment = 'pm ';
				}
			} else if((nts - (now.getHours() + 24) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000) <= pts) {
				/*昨天*/
				moment = 'ysterday';
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

/*封装了各种常用的工具函数
 * 2015-09-15
 */

/**
 * @author					连接科技
 * @description			封装了各种常用的工具函数
 * @namespace				Tool
 * @version					1.0.0
 */

! function(window) {
	var tl = {
		/** documented as Tool.initApp */
		initApp: function(args) {
			/**
			 * 初始化APP，即打开app后的第一个展现在用户面前的window，称为首页
			 * 首页的展现分两种模式：
			 * 	1.openWin(默认)
			 *  2.openDrawerLayout抽屉式侧滑window
			 *
			 * @method	initApp
			 * @memberof Tool
			 * @param		{object}	args								参数对象
			 * @param		{string}	args.displayType		展现的模式：win[默认] | drawerLayout
			 * @param		{string}	args.name						首页自定义名称，默认：Init
			 * @param		{string}	args.fileName				首页的 html 文件名
			 * @param		{object}	args.animation			动画参数，默认：{type: 'fade'}，具体内部参数说明参考apicloud文档
			 * @param		{object}	args.leftPane				左边侧滑 window，具体内部参数说明参考apicloud文档
			 * @param		{object}	args.rightPane			右边侧滑 window，具体内部参数说明参考apicloud文档
			 */

			if(args && args.displayType == 'drawerLayout') {
				//首页以openDrawerLayout打开
				api.openDrawerLayout({
					name: args ? args.name ? args.name : 'Init' : 'Init',
					url: api.wgtRootDir + '/' + (args ? args.fileName ? args.fileName : 'init' : 'init') + '.html',
					rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto'
					},
					bounces: false,
					slidBackEnabled: false,
					animation: args.animation || {
						type: 'fade'
					},
					leftPane: args.leftPane || '',
					rightPane: args.rightPane || '',
					reload: true
				});
			} else {
				//首页以openWin方法打开
				api.openWin({
					name: args ? args.name ? args.name : 'Init' : 'Init',
					url: api.wgtRootDir + '/' + (args ? args.fileName ? args.fileName : 'init' : 'init') + '.html',
					rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto'
					},
					bounces: false,
					slidBackEnabled: false,
					reload: false,
					animation: args ? args.animation || {
						type: 'fade'
					} : {
						type: 'fade'
					}
				});
			}
		},
		exitApp: function() {
			/**
			 * app退出逻辑，一般在 Init 首页设置
			 * @method	exitApp
			 * @memberof Tool
			 */
			api.addEventListener({
				name: 'keyback'
			}, function(ret, err) {
				api.toast({
					msg: '再按一次返回键退出',
					duration: 2000,
					location: 'bottom'
				});

				api.addEventListener({
					name: 'keyback'
				}, function(ret, err) {
					api.closeWidget({
						silent: true
					});
				});

				setTimeout(function() {
					tl.exitApp();
				}, 2000)
			});
		},
		makeCall: function(phone) {
			/**
			 * 拨打电话
			 * @method	makeCall
			 * @memberof Tool
			 * @param		{string}	phone		电话号码
			 */
			if(phone) {
				api.call({
					type: 'tel_prompt',
					number: phone
				});
			}
		},
		toast: function(msg) {
			/**
			 * 弹出一个定时自动关闭的提示框
			 * @method	toast
			 * @memberof Tool
			 * @param		{string}	msg		提示信息
			 */
			api.toast({
				msg: msg,
				duration: 2000,
				location: 'middle'
			});
		},
		removeHTMLTag: function(htmlCode) {
			/**
			 * 过滤 html 标签
			 * @method	removeHTMLTag
			 * @memberof Tool
			 * @param		{string}	htmlCode		html代码字符串
			 * @return	{string}	已过滤掉html代码的字符串
			 */
			htmlCode = htmlCode.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
			htmlCode = htmlCode.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
			//htmlCode = htmlCode.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
			htmlCode = htmlCode.replace(/&nbsp;/ig, ''); //去掉&nbsp;
			return htmlCode;
		},
		toHTML: function(str) {
			/**
			 * 将字符串中的实体字符转换为 html 代码
			 * @method	toHTML
			 * @memberof Tool
			 * @param		{string}	str		带有实体字符的 html 代码字符串
			 * @return	{string}	html 代码字符串
			 */
			if(str) {
				var regx = /&[l,g]t;|&quot;|&nbsp;|&amp;#39;|&amp;/gm,
					_html = str.replace(regx, function(match) {
						switch(match) {
							case '&amp;#39;':
								return '\'';
							case '&lt;':
								return '<';
							case '&gt;':
								return '>';
							case '&quot;':
								return '"';
							case '&nbsp;':
								return '';
							case '&amp;':
								return '&';
						}
					});
				return _html;
			} else {
				return '';
			}
		},
		imageCompressByQiNiu: function(url, mode, w, h) {
			/**
			 * 七牛图片压缩
			 * 移动端：/0/w/<Width>/h/<Height>
			 * PC端：/2/w/<Width>/h/<Height>
			 * @see 具体文档说明：{@link http://developer.qiniu.com/code/v6/api/kodo-api/image/imageview2.html}
			 *
			 * @method	imageCompressByQiNiu
			 * @memberof Tool
			 * @param		{string}	url		图片在七牛存储空间上的地址
			 * @param		{number}	mode	压缩模式
			 * @param		{number}	w			限定缩略图最大的宽度
			 * @param		{number}	h			限定缩略图最大的高度
			 * @return	{string}	图片压缩后的地址
			 */

			return url + '?imageView2/' + mode + '/w/' + w + '/h/' + h;
		},
		refreshMoney: function(money, flag) {
			/*更新余额
			 * flag：0扣除金额；1增加金额
			 */
			var memberInfo = $api.getStorage('memberInfo');
			if(flag) {
				memberInfo.money = parseFloat(memberInfo.money) + parseFloat(money);
			} else {
				memberInfo.money = parseFloat(memberInfo.money) - parseFloat(money);
			}
			$api.setStorage('memberInfo', memberInfo);
			api.sendEvent({
				name: 'refreshMoney'
			});
		},
		refreshIntegral: function(integral, flag) {
			/*更新积分
			 * flag：0扣除利币；1增加利币
			 */
			var memberInfo = $api.getStorage('memberInfo');
			if(flag) {
				memberInfo.integral = parseInt(memberInfo.integral) + parseInt(integral);
			} else {
				memberInfo.integral = parseInt(memberInfo.integral) - parseInt(integral);
			}
			$api.setStorage('memberInfo', memberInfo);
			api.sendEvent({
				name: 'refreshIntegral'
			});
		},
		getSomePic: function(args) {
			/*获取多张图片
			 */
			this.getSomeMedia(args);
		},
		getSomeMedia: function(args) {
			/**
			 * 获取多张图片或视频的回调函数
			 * @callback	getSomeMediaCallback
			 * @param		{object}		ret
			 * @param		{object[]}	ret.list - 返回选定的资源信息数组
			 * @param		{string}		ret.list[].path - 资源路径，返回资源在本地的绝对路径
			 * @param		{string}		ret.list[].thumbPath - 缩略图路径，返回资源缩略图在本地的绝对路径
			 * @param		{string}		ret.list[].suffix - 文件后缀名，如：png，jpg, mp4
			 * @param		{number}		ret.list[].size - 资源大小，单位（Bytes）
			 * @param		{string}		ret.list[].time - 资源创建时间，格式：yyyy-MM-dd HH:mm:ss
			 */
			/**
			 * 获取多张图片或视频
			 * @method	getSomeMedia
			 * @memberof Tool
			 * @param  {object}    args - 参数对象
			 * @param  {number}    [args.max=5] - 最多可选的图片数
			 * @param  {object}    [args.sort] - 图片排序方式
			 * @param  {string}    [args.sort.key=time] - 按图片创建时间排序
			 * @param  {string}    [args.sort.order=desc] - 排序方式：desc(新->旧) | asc(旧->新)
			 * @param  {string}    [args.type=picture] - 返回的资源种类：all | picture | video
			 * @param  {object}    [args.scrollToBottom] - 打开媒体资源界面后间隔一段时间开始自动滚动到底部设置
			 * @param  {number}    [args.scrollToBottom.intervalTime=-1] - 打开媒体资源界面后间隔的时间开始自动滚动到底部，单位秒（s），小于零的数表示不滚动到底部
			 * @param  {boolean}   [args.scrollToBottom.anim=true] - 滚动时是否添加动画，android 平台不支持动画效果
			 * @param  {boolean}   [args.transPath=false] - 是否将相册图片地址转换为可以直接使用的本地路径地址（临时文件夹的绝对路径）
			 * @param  {getSomeMediaCallback}  args.success - 成功获取图片的回调
			 */

			var obj = api.require('UIMediaScanner'),
				sort = {
					key: 'time',
					order: 'desc'
				},
				scrollToBottom = {
					intervalTime: -1,
					anim: true
				};
			obj.open({
				type: typeof args === 'object' ? args.type || 'picture' : 'picture',
				column: 4,
				classify: true,
				max: typeof args === 'object' ? args.max || 5 : 5,
				sort: args.sort || sort,
				texts: {
					stateText: 'Camera Roll',
					classifyTitle: 'Album',
					selectedMaxText: 'Select a maximum of ' + (args.max || 5) + ' photos',
					cancelText: 'Cancel',
					finishText: 'Done',
					okBtnText: 'OK'
				},
				styles: {
					bg: '#fff',
					mark: {
						icon: '',
						position: 'bottom_left',
						size: 20
					},
					nav: {
						bg: '#eee',
						stateColor: '#000',
						stateSize: 18,
						cancelBg: 'rgba(0,0,0,0)',
						cancelColor: '#000',
						cancelSize: 16,
						finishBg: 'rgba(0,0,0,0)',
						finishColor: '#000',
						finishSize: 16
					}
				},
				scrollToBottom: args.scrollToBottom || scrollToBottom,
				exchange: true
			}, function(ret) {
				if(ret.eventType == 'cancel') {
					args.success(ret)
				}
				var index = 0; //记录图片索引
				//闭包：将相册图片地址转换为可以直接使用的本地路径地址（临时文件夹的绝对路径）
				function transPath(path) {
					obj.transPath({
						path: path
					}, function(ret2, err) {
						if(ret) {
							ret.list[index].path = ret2.path;
							index += 1;
							if(ret.list.length > index) {
								//继续转换下一张图片路径
								transPath(ret.list[index].path);
							} else {
								//图片路径转换结束，重置索引
								index = 0;
								//执行回调，返回转换路径后的图片数组
								args.success(ret)
							}
						}
					});
				}
				if(ret.list instanceof Array && ret.list.length != 0) {
					if(args.transPath) {
						transPath(ret.list[index].path);
					} else {
						//							Debug.alt(JSON.stringify(ret,null,2))
						args.success(ret)
					}
				}
			});
		},
		getOnePic: function(args) {
			/*获取单张图片
			 */
			this.getOneMedia(args);
		},
		getOneMedia: function(args) {
			/**
			 * 通过系统相册或拍照获取单张图片的回调函数
			 * @callback	getOneMediaCallback
			 * @param	{object}	ret
			 * @param	{string}	ret.data - 图片路径
			 * @param	{string}	ret.base64Data - base64数据，destinationType为base64时返回
			 * @param	{number}	ret.number - 视频时长（数字类型）
			 */

			/**
			 * 通过系统相册或拍照获取单张图片
			 * @method   getOneMedia
			 * @memberof   Tool
			 * @param  {object}      args
			 * @param  {string}      [args.mediaValue=pic] - 媒体类型: pic | video
			 * @param  {string}      [args.destinationType=url] - 返回图片数据类型: url | base64
			 * @param  {string}      [args.videoQuality=medium] - 视频质量(仅ios): low | medium | high
			 * @param  {string}      [args.sourceType=library] - 图片源类型: library | camera
			 * @param  {string}      [args.encodingType=jpg] - 返回图片类型: jgp | png
			 * @param  {number}      [args.quality=50] - 图片质量，只针对jpg格式图片(0-100整数)
			 * @param  {boolean}     [args.allowEdit=false] - 是否可以选择图片后进行编辑，支持iOS及部分安卓手机
			 * @param  {getOneMediaCallback}    args.success - 成功获取多媒体资源的回调
			 */
			api.getPicture({
				mediaValue: args.mediaValue || 'pic',
				videoQuality: args.videoQuality || 'medium',
				sourceType: args.sourceType || 'library',
				encodingType: args.encodingType || 'jpg',
				destinationType: args.destinationType || 'url',
				quality: args.quality || 50,
				allowEdit: typeof args.allowEdit === 'boolean' ? args.allowEdit : false
			}, function(ret, err) {
				if(ret && ret.data) {
					args.success(ret);
				}
			});
		},
		actionSheet: function(args) {
			/**
			 * actionSheet点击按钮后的回调
			 * @callback	actionSheetCallback
			 * @param	{number}	buttonIndex	- 返回按钮点击序号，从1开始
			 */

			/**
			 * 底部弹出框
			 * @method actionSheet
			 * @memberof Tool
			 * @param  {object}    args
			 * @param  {string}    [args.title] - 标题
			 * @param  {string}    [args.cancelTitle=取消] - 取消按钮标题
			 * @param  {string[]}     [args.buttons] - 按钮
			 * @param  {object}    [args.style=actionSheetStyle] - 样式设置，不传时使用默认样式
			 * @param  {actionSheetCallback}  args.success - 点击按钮后的回调
			 * @example
			 * Tool.actionSheet({
			 *   buttons: ['按钮1', '按钮2'],
			 *   success: function(buttonIndex){
			 *     switch(buttonIndex){
			 *       case 1:
			 *         //code
			 *         break;
			 *     }
			 *   }
			 * })
			 */
			var actionSheetStyle = {
				layerColor: 'rgba(0, 0, 0, 0.3)',
				itemNormalColor: '#F1F1F1',
				itemPressColor: '#007AFF',
				fontNormalColor: '#007AFF',
				fontPressColor: '#F1F1F1'
			};
			api.actionSheet({
				title: args.title || '',
				cancelTitle: args.cancelTitle || '',
				buttons: args.buttons,
				style: args.style || actionSheetStyle
			}, function(ret, err) {
				args.success(ret.buttonIndex);
			});
		},
		parseDate: function(timestamp) {
			/**
			 * 将时间戳转换为年、月、日、时、分、秒
			 * @method	parseDate
			 * @memberof	Tool
			 * @param		{(number|string)}	timestamp	- 时间戳
			 * @return	{object}	返回的对象包括：year、month、date、hour、minute、second
			 */
			timestamp = timestamp.toString();
			if(timestamp.length == 10) {
				/*PHP返回的时间戳长度为10，JS要求的长度必须13
				 * 若长度不足，则以0补充
				 */
				timestamp = parseInt(timestamp) * 1000;
			}
			var _d = new Date(parseInt(timestamp));
			return {
				year: _d.getFullYear(),
				month: _d.getMonth() + 1,
				date: _d.getDate(),
				hour: _d.getHours(),
				minute: _d.getMinutes(),
				second: _d.getSeconds(),
			};
		},
		onCall: function() {
			var voiceMag = api.require('voiceMag');
			voiceMag.onCall(); //改为听筒播放音频
		},
		onNormal: function() {
			var voiceMag = api.require('voiceMag');
			voiceMag.onNormal(); //使用扩音器播放音频
		},
		startPlay: function(path) {
			//播放语音
			var voiceMag = api.require('voiceMag');
			voiceMag.startPlay({
				path: path
			});
		},
		stopPlay: function() {
			var voiceMag = api.require('voiceMag');
			voiceMag.stopPlay();
		},
		openPhotoBrowser: function(args) {
			/**
			 * 打开一个图片浏览器，可以 frame（全屏）的形式打开并添加到主窗口上
			 * 开发者可通过 openFrame 打开多个 frame，来自定义上下导航条的样式及其功能。
			 * 本方法支持横竖屏。加载的网络图片会被缓存到本地
			 *
			 *args 内部结构
			 * images 要读取的图片路径组成的数组，图片路径支持fs://、widget://、http://协议
			 * activeIndex[0] 当前要显示的图片在图片路径数组中的索引
			 * placeholderImg 当加载网络图片时显示的占位图路径，要求本地图片路径(widget://、fs://)
			 * bgColor['#000'] 图片浏览器背景色，支持rgb、rgba、#
			 * show 打开浏览器并显示的回调
			 * change 用户切换图片的回调
			 * click 用户单击图片浏览器的回调
			 * loadImgSuccess 网络图片下载成功的回调事件的回调
			 * longPress 用户长按图片事件的回调
			 *
			 *@return
			 * eventType 交互事件类型，取值范围如下：
			 * 		show：打开浏览器并显示
			 * 		change：用户切换图片
			 * 		click：用户单击图片浏览器
			 * 		loadImgSuccess：网络图片下载成功的回调事件
			 * 		longPress：用户长按图片事件
			 * index 数字类型；当前图片在图片路径数组中的索引
			 */
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.open({
				images: args.images,
				activeIndex: args.activeIndex || 0,
				placeholderImg: args.placeholderImg || '',
				bgColor: args.bgColor || '#000'
			}, function(ret, err) {
				switch(ret.eventType) {
					case 'show':
						if(typeof args.show === 'function') {
							args.show(photoBrowser, ret.index);
						}
						break;
					case 'change':
						if(typeof args.change === 'function') {
							args.change(photoBrowser, ret.index);
						}
						break;
					case 'click':
						if(typeof args.click === 'function') {
							args.click(photoBrowser, ret.index);
						}
						break;
					case 'loadImgSuccess':
						if(typeof args.loadImgSuccess === 'function') {
							args.loadImgSuccess(photoBrowser, ret.index);
						}
						break;
					case 'longPress':
						if(typeof args.longPress === 'function') {
							args.longPress(photoBrowser, ret.index);
						}
						break;
				}
			});
		},
		cardReader: function(callback) {
			/*cardReader封装了PayPal的cardio识别库，
			 * 用户只需用摄像头扫描信用卡即可实现卡号的输入
			 *
			 *@ret
			 * 	cardNum 卡号
			 * 	expiryMonth 过期日期的月
			 * 	expiryYear 过期日期的年
			 * 	cvv cvv号
			 */
			var obj = api.require('cardReader');
			obj.open(function(ret, err) {
				if(ret.status) {
					callback(ret);
				}
			});
		},
		shareAction: function(args) {
			/*shareAction 是一个调用系统分享功能的模块，通过该模块能够分享一些最常见的文本，图片信息等
			 *
			 *args 内部结构
			 * text 要分享的文本信息
			 * type 分享文件的类型: text/image/audio/file
			 * path 分享文件的路径，要求本地路径(fs://，widget://)。Android 平台不支持 widget:// 路径
			 */
			var sharedModule = api.require("shareAction");
			sharedModule.share({
				text: args.text,
				type: args.type,
				path: args.path
			});
		},
		formatCurrency: function(num) {
			/**
			 * 将数值四舍五入(保留2位小数)后格式化成金额形式
			 * @method 		formatCurrency
			 * @memberof	Tool
			 * @param			{number}		num			原始金额数值
			 * @return		{float}			已格式化的金额数值
			 */
			num = num.toString().replace(/\$|\,/g, '');
			if(isNaN(num))
				num = "0";
			sign = (num == (num = Math.abs(num)));
			num = Math.floor(num * 100 + 0.50000000001);
			cents = num % 100;
			num = Math.floor(num / 100).toString();
			if(cents < 10)
				cents = "0" + cents;
			for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
				num = num.substring(0, num.length - (4 * i + 3)) + ',' +
				num.substring(num.length - (4 * i + 3));
			return(((sign) ? '' : '-') + num + '.' + cents);
		},
		getCacheSize: function(args) {
			/**
			 * 计算缓存大小
			 * @method	getCacheSize
			 * @memberof	Tool
			 * @param		{object}		args
			 * @param		{string}		args.container		显示缓存大小的节点的选择器标识符
			 */
			api.getCacheSize({
				sync: false
			}, function(ret, err) {
				var size = ret.size / Math.pow(1024, 2);
				$api.text($api.dom(args.container), (size ? size.toFixed(2) : 0) + 'MB');
			});
		},
		clearCache: function(args) {
			/**
			 * 清除缓存后的回调
			 * @callback		clearCacheCallback
			 */

			/**
			 * 清除缓存
			 * @method	 	clearCache
			 * @memberof	Tool
			 * @param			{object}								args
			 * @param			{string}								args.container - 清除缓存后，重新显示缓存大小的节点的选择器标识符
			 */
			var self = this;
			api.confirm({
				title: '提示信息',
				msg: '你确定要清除缓存吗？',
				buttons: ['取消', '确定']
			}, function(ret, err) {
				if(ret.buttonIndex == 2) {
					var fs = api.require('fs');
					api.showProgress({
						title: '处理中...'
					});
					//关闭本地数据库
					DB.closeDatabase({
						name: CONFIG.DB.NAME,
						success: function() {
							//删除数据库文件夹
							fs.rmdir({
								path: 'fs://db'
							}, function(ret, err) {
								if(ret.status) {
									//重新初始化数据库
									DB.init();
									//清除apicloud产生的缓存
									api.clearCache({
										timeThreshold: 0
									}, function(ret, err) {
										api.getCacheSize({
											sync: false
										}, function(ret, err) {
											api.hideProgress();
											//重新计算缓存大小
											self.getCacheSize({
												container: args.container
											});
											api.toast({
												location: 'middle',
												msg: '缓存清理完毕'
											});
										});
									});
								} else {
									api.hideProgress();
									api.toast({
										location: 'middle',
										msg: '缓存清理失败'
									});
								}
							});
						}
					});
				}
			});
		},
		loadImageAsync: function(url) {
			return new Promise(function(resolve, reject) {

				if(!url) {
					resolve();
					return;
				}

				var image = new Image();

				image.onload = function() {
					resolve(image);
				};

				image.onerror = function() {
					reject(new Error('Could not load image at ' + url));
				};

				image.src = url;
			});
		},
		smartUpdateFinish: function() {
			/*监听静默更新事件*/
			api.addEventListener({
				name: 'smartupdatefinish'
			}, function(ret, err) {
				api.alert({
					title: '提示',
					msg: '新的更新包已经安装成功，重启后生效'
				}, function(ret, err) {
					//重启app
					api.rebootApp();
				});
			});
		},
		memberInfo: function(callback) {
			//获取用户信息
			if($api.getStorage(CONFIG.KEY.MEMBER_ID) && $api.getStorage(CONFIG.KEY.TOKEN)) {
				var ctrl = CONFIG.MEMBER_INFO_API.CTRL,
					fn = CONFIG.MEMBER_INFO_API.FN;
				ajax.get({
					ctrl: ctrl,
					fn: fn,
					data: {
						values: {
							id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
							token: $api.getStorage(CONFIG.KEY.TOKEN)
						}
					},
					hideLoading: true,
					showError: true,
					showProgress: false,
					success: function(ct) {
						$api.setStorage(CONFIG.KEY.MEMBER_INFO, ct.memberinfo);
						if(typeof callback == 'function') {
							callback(ct.memberinfo);
						}
					}
				});
			}
		},

		//lat lon定位
		//		uploadPosition: function() {
		//			ajax.get({
		//				ctrl: 'My',
		//				fn: 'uploadPosition',
		//				hideLoading: true,
		//				showError: true,
		//				showProgress: true,
		//				data: {
		//					values: {
		//						id: $api.getStorage(CONFIG.KEY.MEMBER_ID),
		//						token: $api.getStorage(CONFIG.KEY.TOKEN),
		////						x: $api.getStorage('lon'),
		////						y: $api.getStorage('lat')
		//	                    $api.getStorage(CONFIG.KEY.LAT),
		//						$api.getStorage(CONFIG.KEY.LON)
		//					}
		//				},
		//				success: function() {
		//				}
		//			})
		//		},
		rmNull: function(data) {
			/*替换null字段*/
			if(data && (data != 'undefined' || data != 'null')) {
				return data;
			} else {
				return '';
			}
		},
		relogin: function() {
			//退出登录

			//去除缓存
			$api.rmStorage(CONFIG.KEY.MEMBER_ID);
			$api.rmStorage(CONFIG.KEY.TOKEN);
			$api.rmStorage(CONFIG.KEY.MEMBER_INFO);
			api.sendEvent({
				name: CONFIG.KEY.RELOGIN_EVENT
			});
			api.execScript({
				name: 'root',
				script: 'openLogin()'
			});
			if(api.winName != 'root') {
				api.closeToWin({
					name: 'root'
				});
				//		api.closeToWin({
				//			name: 'root'
				//		});
			}
		},
		formatDate: function(t, format, flag, flag2) {
			/*格式时间*/
			/*string format 年 Y 月 M 日 D 时 h 分 m 秒 s 例如 YMDhms
			 * 不填 则 采用动态返回 即当天时间隐藏月份日期  当年时间隐藏年份
			 */
			if(typeof t === 'string') {
				var t = t.replace(/-/g, '/');
				t = new Date(t);
			}
			var now = new Date();
			var month = (t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1;
			var date = t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
			var hours = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
			var min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
			var sec = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();
			var result = '';
			var f = flag ? flag : '-';
			var f2 = flag2 ? flag2 : ':';
			if(format) {
				if(format.indexOf('Y') >= 0) {
					result += t.getFullYear();
				}
				if(format.indexOf('M') >= 0 && format.indexOf('Y') < 0) {
					result += month;
				} else if(format.indexOf('M') >= 0) {
					result += f + month;
				}
				if(format.indexOf('D') >= 0) {
					result += f + date;
				}
				if(format.indexOf('h') >= 0 && format.indexOf('D') < 0) {
					result += hours;
				} else if(format.indexOf('h') >= 0) {
					result += ' ' + hours;
				}
				if(format.indexOf('m') >= 0) {
					result += f2 + min;
				}
				if(format.indexOf('s') > 0) {
					result += f2 + sec;
				}
				return result;
			} else {
				if(t.getFullYear() == now.getFullYear()) {
					if(t.getDate() == now.getDate() && t.getMonth() == now.getMonth()) {
						return hours + ':' + min;
					} else {
						return month + '-' + date;
					}
				} else {
					return t.getFullYear() + '-' + month + '-' + date;
				}
			}
		},
		toEngDate: function(t, type) {
			if(typeof t === 'string') {
				var t = t.replace(/-/g, '/');
				t = new Date(t);
			}
			var strs = t.toString().split(' ', 4);
			if(type == 'MD') {
				return strs[1] + ' ' + strs[2];
			} else if(type == 'YMD') {
				return strs[2] + ' ' + strs[1] + ' ' + strs[3];
			}
		},
		openWin: function(args) {
			/**
			 * 打开win
			 * @param 	winName	{string}	win名称
			 * @param		winUrl	{string}	win页面路径
			 * @param 	frameName	{string}	frame名称
			 * @param 	title	{string}	窗口标题
			 * @param 	frameUrl	{string}	frame页面路径
			 * @param 	bounces	{boolean}	是否可弹动
			 * @param 	frameParam	{Object} 子窗口附带参数
			 * @param		winAnimation{Object}	win打开动画
			 * @param 	delay	{number}	（可选项）window 显示延迟时间，适用于将被打开的 window 中可能需要打开有耗时操作的模块时，可延迟 window 展示到屏幕的时间，保持 UI 的整体性
			 */
			api.openWin({
				name: args.winName,
				url: args.winUrl ? args.winUrl : api.wgtRootDir + '/html/window/' + args.winName + '.html',
				pageParam: {
					headerTitle: args.title,
					frameName: args.frameName ? args.frameName : args.frameUrl,
					frameUrl: args.frameUrl ? args.frameUrl : api.wgtRootDir + '/html/' + args.frameName + '.html',
					frameParam: args.frameParam || {},
					bounces: args.bounces || false
				},
				reload: typeof args.reload == 'boolean' ? args.reload : false,
				slidBackEnabled: typeof args.slidBackEnabled == 'boolean' ? args.slidBackEnabled : false,
				animation: args.winAnimation,
				delay: api.systemType == 'ios' ? 0 : args.delay || 200,
				softInputBarEnabled: false, //隐藏iOS键盘上方的工具条
				softInputMode: 'resize'
			});
		},
		openFrame: function(args) {
			/**
			 * @param 	frameName	{string}	frame名
			 * @param 	frameUrl	{string}	frame路径文件夹
			 * @param 	bounces	{boolean}	是否可弹动
			 * @param 	frameParam	{Object} 窗口附带参数
			 * @param 	animation	{Object}  动画类型
			 */

			var rect = {};

			try {
				var main = $api.dom('#main'),
					mainPos = $api.offset(main),
					header = $api.dom('#header'),
					headerPos = $api.offset(header);
				rect.x = 0;
				rect.y = headerPos.h;
				rect.w = 'auto';
				rect.h = mainPos.h
			} catch(e) {

			}

			api.openFrame({
				name: args.frameName ? args.frameName : args.fUrl,
				url: args.frameUrl,
				bgColor: args.bgColor ? args.bgColor : 'transparent',
				bounces: args.bounces || false,
				pageParam: args.frameParam || {},
				rect: args.rect || rect,
				animation: args.animation || {
					type: "none",
					subType: "",
					duration: 0
				},
				softInputBarEnabled: false, //隐藏iOS键盘上方的工具条
			});
		},
		checkUpdate: function(args) {
			/**
			 * 检查更新后的回调
			 * @success		checkUpdateCallback
			 * @param {boolean}
			 * 无更新：{update:false,closed:false}
			 * 有更新：{update:true,closed:false}
			 * 有更新，强制更新：{update:true,closed:true}
			 * 无更新，强制关闭：{update:false,closed:true}
			 */

			/**
			 * 检查更新
			 * @method	 	checkUpdate
			 * @memberof	Tool
			 */
			var mam = api.require('mam');
			mam.checkUpdate(function(ret, err) {
				if(ret && ret.result) {
					if(typeof args.success == 'function') {
						args.success(ret.result);
					}
				}
			});
		},

	};
	window.Tool = tl;
}(window);

/*
 * 数据异步请求模块3
 * 创建于2016-9-16
 */

/**
 * @author					连接科技
 * @description			数据异步请求模块3
 * @namespace				ajax
 * @version					3.0.0
 */
(function(window) {
	var ajax = {
		args: '',
		baseUrl: '',
		method: 'post',
		timeout: 30,
		cache: true,
		report: false,
		dataType: 'json',
		showLoading: true,
		returnAll: true,
		data: '',
		before: function(args) {
			/**
			 * 发起异步请求之前的逻辑处理
			 */
			if(!args.hideLoading) {
				var code = '' +
					'<div class="null flex-box-v" style="z-index: 1;">' +
					'<div class="desc">' +
					'Loading...' +
					'</div>' +
					'</div>';
				try {
					if(args.container) {
						$api.html($api.dom(args.container), code);
					} else {
						$api.html($api.dom('#main'), code);
					}
				} catch(e) {

				}
			}
			if(!!args.showProgress) {
				api.showProgress({
					title: args.showProgress.title || 'Loading...',
					text: args.showProgress.text || 'Please wait...',
					modal: typeof args.showProgress.modal === 'boolean' ? args.showProgress.modal : true
				});
			}
		},
		success: function(ret) {
			if(parseInt(ret.statusCode) == 200) {
				if(this.args.showProgress) {
					api.hideProgress();
				}
				switch(parseInt(ret.body.status)) {
					case 200:
						//自家服务器成功返回数据
						this.serverStatus_200(ret);
						break;
					case 404:
						//自家服务器拒绝访问，可能原因：参数传错/传漏
						this.serverStatus_404(ret);
						break;
					case 403:
						//因权限不足，自家服务器拒绝访问，可能原因：登录信息过期/在其他端登录
						this.serverStatus_403(ret);
						break;
				}
				if(this.args.loadType) {
					this.loadType();
				}
			}
		},
		serverStatus_200: function(ret) {
			//自家服务器返回状态码为200
			var self = this,
				jsonText,
				ct = ret.body.content,
				convertField,
				regx = /'/gm;
			if(this.args.cache && this.args.cache.key) {
				//缓存数据到本地数据库
				convertField = this.args.cache.convertField;
				if(convertField) {
					//处理需要进行转义的字段
					convertField.forEach(function(value, index) {
						var arrangement = value.split('.'),
							field = ct,
							i;
						if(arrangement.length == 1) {
							field[arrangement[0]] = field[arrangement[0]].replace(regx, function(match) {
								switch(match) {
									case "'":
										return "&apos;";
								}
							});
						} else {
							for(i = 0; i < arrangement.length; i++) {
								if(i == arrangement.length - 1) {
									field[arrangement[i]] = field[arrangement[i]].replace(regx, function(match) {
										switch(match) {
											case "'":
												return "&apos;";
										}
									});
								} else {
									field = field[arrangement[i]];
								}
							}
						}
					});
				}
				jsonText = JSON.stringify(ret.body.content);
				//					console.log(jsonText)
				/*缓存服务器数据*/
				if(this.localCache != jsonText) {
					/*对比数据*/
					DB.setValue({
						key: self.args.cache.key,
						value: jsonText,
						flag: self.localCache ? 1 : 0
					});
				}
			}
			if(typeof this.args.success == 'function') {
				this.args.success(ret.body.content, this.localCache);
			}
		},
		serverStatus_404: function(ret) {
			function showError() {
				if(ajax.args.showError) {
					if(ret.body.msg) {
						api.toast({
							msg: ret.body.msg,
							location: 'bottom',
							duration: 3000
						});
					} else {
						api.toast({
							msg: '服务器拒绝访问~',
							location: 'bottom',
							duration: 2000
						});
					}
				}
			}
			//自家服务器返回状态码为404
			if(typeof this.args._404 === 'function') {
				this.args._404(ret.body.msg);
			} else {
				if(this.args.location && api.systemType == 'ios') {
					var privacy = api.require('privacy');
					privacy.location(function(ret, err) {
						if(ret.status) {
							showError();
						} else {
							if(typeof ajax.args.locationFail === 'function') {
								ajax.args.locationFail();
							} else {
								api.alert({
									title: '温馨提示',
									msg: '请对本应用授权定位服务以体验全部功能'
								});
							}
						}
					});
				} else {
					showError();
				}
			}
		},
		serverStatus_403: function(ret) {
			//自家服务器返回状态码为403
			if(typeof this.args._403 === 'function') {
				this.args._403();
			} else {
				var logints = $api.getStorage('logints'),
					nowts = new Date().getTime();
				/*验证登录时间戳*/
				if(logints) {
					if('string' === typeof logints) {
						logints = parseInt(logints);
					}
					if(nowts - logints < 1000 * 60 * 60 * 24 * 30) {
						api.alert({
							title: 'Tips',
							msg: 'Please login.',
							buttons: ['OK']
						}, function(ret, err) {
							Tool.relogin();
						});
					} else {
						api.alert({
							title: 'Tips',
							msg: 'Please login.',
							buttons: ['OK']
						}, function(ret, err) {
							Tool.relogin();
						});
					}
				} else {
					api.alert({
						title: 'Tips',
						msg: 'Please login.',
						buttons: ['OK']
					}, function(ret, err) {
						Tool.relogin();
					});
				}
			}
		},
		loadType: function() {
			//数据异步请求完成后，页面UI后续处理
			switch(this.args.loadType) {
				case 1:
					/*去除下拉刷新样式*/
					api.refreshHeaderLoadDone();
					break;
				case 2:
					/*scrolltobottom事件, 去除“加载中...”UI*/
					$api.remove($api.dom('.load-more'));
					break;
			}
		},
		error: function(err) {
			//异步请求失败
			api.hideProgress();
			if(this.args.loadType) {
				this.loadType();
			}
			var msg =
				(typeof err.statusCode === 'undefined' ? '' : err.statusCode + '/') +
				(typeof err.code === 'undefined' ? '' : err.code + '-') +
				(err.msg ? err.msg : '');
			api.toast({
				msg: msg || 'unknow error',
				location: 'top',
				duration: 3000
			});
			//			switch(parseInt(err.statusCode)){
			//				case 0:
			//					//异步请求超时，或网络有问题
			//					this.errorStatusCode_0(err);
			//					break;
			//				case 500:
			//					//服务器遇到了意料不到的情况，不能完成客户的请求
			//					this.errorStatusCode_500(err);
			//					break;
			//			}
		},
		errorStatusCode_0: function(err) {
			//异步请求超时，或网络有问题
			switch(parseInt(err.code)) {
				case 0:
					//网络有问题
					api.toast({
						msg: '连接错误，请检查网络或者请求配置是否正确',
						location: 'top'
					});
					break;
				case 1:
					//请求超时
					api.toast({
						msg: '网络请求超时，请稍后重试',
						location: 'top'
					});
					break;
			}
		},
		errorStatusCode_500: function(err) {
			//服务器遇到了意料不到的情况，不能完成客户的请求

		},
		get: function(args) {
			/**
			 * 成功返回缓存数据的回调处理
			 * @callback   getCacheCallback
			 * @param    {object}    cache - 对应接口的本地缓存对象
			 *
			 * 服务器成功返回数据的回调处理
			 * @callback   successCallback
			 * @param    {object}    ct - 对应接口主内容
			 * @param    {object}    cache - 对应接口的本地缓存数据
			 *
			 * 服务器拒绝访问的回调处理
			 * @callback   _404Callback
			 *
			 * 权限不足的回调处理
			 * @callback   _403Callback
			 */

			/**
			 * 异步请求方法
			 * @method     get
			 * @memberof   ajax
			 * @param      {object}                args
			 * @param			{string}								args.url - 完整的请求链接，优先级大于[args.ctrl/args.fn]
			 * @param      {string}                args.ctrl - 请求接口
			 * @param      {string}                args.fn - 接口方法
			 * @param      {object}                args.cache - 是否使用缓存机制(db模块)
			 * @param      {string}                args.cache.key - 缓存的键值
			 * @param      {getCacheCallback}      args.cache.getCache - 成功返回缓存数据的回调处理
			 * @param      {number}                args.timeout - 异步请求超时设定
			 * @param      {string}                [args.dataType=json] - 数据返回格式
			 * @param      {boolean}               [args.report=false] - 返回请求进度
			 * @param      {string}                args.tag - ajax标识，用于种植异步
			 * @param      {object}                args.data - 接口方法参数
			 * @param      {object}                args.data.values - 以表单方式提交参数(JSON对象)
			 * @param      {object}                args.showProgress - 是否使用菊花进度UI
			 * @param      {string}                [args.showProgress.title=加载中...] - 标题
			 * @param      {string}                [args.showProgress.text=请稍后...] - 内容
			 * @param      {boolean}               [args.showProgress.modal=true] - 是否模态，模态时整个页面将不可交互
			 * @param      {string}                [args.container=#main] - 模板渲染的父节点
			 * @param      {number}                [args.loadType=0] - 数据加载类型:
			 *                                                       0：不填该参数，不做任何操作
			 *                                                       1：下拉刷新
			 *                                                       2：上拉加载更多
			 * @param      {boolean}               [args.hideLoading=false] - 是否隐藏"加载中..."占位代码
			 * @param      {boolean}               [args.showError=false] - 请求失败后(404)，是否显示错误信息
			 * @param			{boolean}								args.location - 是否需要定位权限，主要针对ios
			 * @param      {successCallback}       args.success - 200(服务器成功返回数据)回调处理
			 * @param      {_404Callback}          args._404 - 404(服务器拒绝访问)回调处理
			 * @param      {_403Callback}          args._403 - 403(权限不足)回调处理
			 */

			var self = this,
				_url;
			this.args = args;

			this.before(args);

			DB.getValue({
				key: args.cache ? args.cache.key : 'null',
				success: function(cache) {
					if(cache) {
						self.localCache = cache;
						if(args.cache && typeof args.cache.getCache === 'function') {
							try {
								args.cache.getCache(cache);
							} catch(e) {}
						}
					} else {
						self.localCache = '';
					}

					if(args.url) {
						_url = args.url;
					} else {
						_url = CONFIG.AJAX.BASE_URL + '/' + args.ctrl + '/' + args.fn;
					}
					if(!args.noDebug) {
						args.url = _url;
					}
					api.ajax({
						url: _url,
						method: args.method || self.method,
						cache: true,
						report: self.report,
						timeout: args.timeout || self.timeout,
						tag: args.tag || '',
						dataType: args.dataType || self.dataType,
						returnAll: self.returnAll,
						data: (!!args.data ? args.data : '')
					}, function(ret, err) {

						/*jsonp格式转换*/
						if(self.dataType === 'text') {
							try {
								ret.body = $api.strToJson(ret.body.slice(ret.body.indexOf('{'), -2));
							} catch(e) {

							}
						}

						if(CONFIG.DEBUG) {
							if(args.test) {
								Debug.alt('ret' + $api.jsonToStr(ret) + 'err' + $api.jsonToStr(err));
							}
						}
						if(!args.noDebug) {
							console.log(
								JSON.stringify(args, null, 2)
							);
							//							console.log(
							//								JSON.stringify({
							//									url: _url,
							//									value: JSON.stringify(args.data.values).replace(/[\"]/g, '').replace(/[\,]/g, ' ')
							//								}, null, 2)
							//							);
							console.log(
								JSON.stringify(ret, null, 2)
							);
							console.log(
								JSON.stringify(err, null, 2)
							);
						}

						if(ret) {
							self.success(ret);
						} else {
							self.error(err);
						}
					});
				}
			});
		},
		cancel: function(tag) {
			if(tag) {
				api.cancelAjax({
					tag: tag
				});
			}
		}
	};

	window.ajax = ajax;

})(window);

/*
 * 作用：页面刷新
 * 创建于 2015-7-17 21:14
 * 更新：2016-9-24
 */

/**
 * @author				连接科技
 * @description		刷新模块
 * @namespace			Refresh
 * @version				3.0.0
 */

! function(window) {
	var c = {
		init: function(args) {
			/**
			 * 成功刷新的回调
			 * @callback		refreshCallback
			 */

			/**
			 * 初始化下拉刷新功能
			 * @method			init
			 * @memberof		Refresh
			 * @param      	{string}                args.ctrl - 请求接口
			 * @param      	{string}                args.fn - 接口方法
			 * @param			 	{object}								args.values - 接口参数
			 * @param				{string}								[args.textColor=#666] - 提示文字的颜色
			 * @param				{string}								args.field - 异步返回的ct里，需要被遍历合成模板的字段，如：ct[field]
			 * @param				{string}								args.field2 - 异步返回的ct里，需要被遍历合成模板的字段，如：ct[field][field2]
			 * @param      	        {boolean}               [args.showError=false] - 请求失败后(404)，是否显示错误信息
			 * @param				{string}								[args.container=#main] - 模板渲染的父节点
			 * @param				{string}								[args.template=main] - 模板名称
			 * @param				{refreshCallback}				args.success - 成功刷新的回调
			 */
			api.setCustomRefreshHeaderInfo({
				bgColor: 'rgba(0,0,0,0)',
				finishedText: LANGUAGE[$api.getStorage('lan') || 'english']['Refresh'] || 'Refresh',
				dropColor: '#32BBB1',
			}, function(ret, err) {
				//				if('none' === api.connectionType) {
				//					api.toast({
				//						msg: '网络无法连接，请检查网络设备是否正常',
				//						location: 'bottom',
				//						duration: 2000
				//					});
				//					api.refreshHeaderLoadDone();
				//					return;
				//				}
				//				if(args && args.values) {
				//					if(args.values.id && args.values.token) {
				//						if($api.getStorage(CONFIG.KEY.MEMBER_INFO)) {
				//							args.values.id = $api.getStorage(CONFIG.KEY.MEMBER_ID);
				//							args.values.token = $api.getStorage(CONFIG.KEY.TOKEN);
				//						} else {
				//							Tool.toast('请先登录');
				//							api.refreshHeaderLoadDone();
				//							return;
				//						}
				//					}
				//				}
				ajax.get({
					ctrl: args.ctrl,
					fn: args.fn,
					data: {
						values: args.values
					},
					hideLoading: true,
					showError: args.showError,
					loadType: 1, //下拉刷新类型
					success: function(ct) {

						// $api.html($api.dom(args.container||'#main'), doT.template($api.html($api.dom('[template='+(args.template||'main')+']')))(args.field ? ct[args.field] : ct));
						typeof args.beforeRender === 'function' && args.beforeRender(ct);
						var fieldData = '';
						if(args.field) {
							if(args.field2) {
								fieldData = ct[args.field][args.field2];
							} else {
								fieldData = ct[args.field];
							}
						} else {
							fieldData = ct;
						}
						//						console.log('as a helper------:' + JSON.stringify(fieldData, null, 2))
						T.html(args.container || '#main', args.template || 'main', fieldData);
						api.parseTapmode();
						if('function' === typeof args.success) {
							args.success(ct);
						}
					}
				});
				//				setTimeout(function() {
				//					api.refreshHeaderLoadDone()
				//				}, 3000);
			});
		}
	};
	window.Refresh = c;
}(window);

/*
 * 作用：页面滚动的底部时，加载更多信息
 * 创建于 2015-7-8 22：18
 */
! function(window) {
	var c = {
		init: function(args) {
			/**
			 * 成功刷新的回调
			 * @callback		loadmoreCallback
			 */

			/**
			 * 初始化加载更多组件
			 * @method		init
			 * @memberof	LoadMore
			 * @param			{string}		ctrl - 控制器
			 * @param			{string} 		fn - 方法
			 * @param			{object} 		values - 异步请求参数
			 * @param			{boolean}	 	showError - 是否显示错误信息
			 * @param			{boolean} 	test - 是否显示调试信息
			 * @param			{string} 		template - 渲染模板
			 * @param			{string} 		container - 渲染父节点, 模板的包裹层节点
			 * @param			{number}		countType
			 * 					0 默认统计模式，page/pagesize并用;
			 * 					1 时间戳模式，以时间戳为标识获取更多数据;
			 *				function count 自定义判断加载条件是否符合，针对特殊场景，可为空
			 *					return t{
			 *						number status (0:马上终止执行下面的逻辑)
			 *						json values	异步请求所需的参数(status=1:返回values)
			 *					}
			 * @param			{loadmoreCallback} success - 加载更多数据后的回调
			 * @param			{string}		countSelector - 通过该css选择器获取当前节点数，判断是否符合加载下一个分页数据的条件
			 *
			 */
			api.addEventListener({
				name: 'scrolltobottom'
			}, function(ret, err) {
				/*判断是否加载中*/
				var loadMoreDom = $api.dom('.load-more');
				if(loadMoreDom) {
					return;
				}
				var selfValues = {};
				//判读用户是否信息
				if(args && args.values) {
					selfValues = JSON.parse(JSON.stringify(args.values));
					if(selfValues.id && selfValues.token) {
						if($api.getStorage(CONFIG.KEY.MEMBER_INFO)) {
							selfValues.id = $api.getStorage(CONFIG.KEY.MEMBER_ID);
							selfValues.token = $api.getStorage(CONFIG.KEY.TOKEN);
						} else {
							Tool.toast('please login.');
							return;
						}
					}
				}
				if('function' === typeof args.count) {
					var t = args.count();
					if(t && t.status) {
						if(!selfValues) {
							selfValues = {};
						}
						for(var key in t.values) {
							selfValues[key] = t.values[key];
						}
					} else {
						return;
					}
				} else {
					if(args.countType) {
						/*使用时间戳统计模式
							获取时间戳
						*/
						selfValues.time = $api.attr($api.dom(args.countSelector || '#main > div:last-child'), 'timestamp');
					} else {
						/*使用默认统计模式page/pagesize*/
						try {
							var listDoms = $api.domAll(args.countSelector || '#main > div');
							if(listDoms.length == 0 || listDoms.length % 10 != 0) {
								return;
							} else {
								selfValues.page = listDoms.length / 10 + 1;
							}
						} catch(e) {
							return;
						}
					}
				}

				// alert(JSON.stringify(args.values));
				/*渲染“加载更多”UI*/
				var loadMoreCode = '' +
					'<div class="load-more">' +
					'Loading ...' +
					'</div>';
				$api.append($api.dom('#main'), loadMoreCode);
				// alert($api.jsonToStr(args.values))
				ajax.get({
					ctrl: args.ctrl,
					fn: args.fn,
					data: {
						values: selfValues
					},
					hideLoading: true,
					showError: args.showError,
					test: args.test,
					loadType: 2, //scrolltobottom类型
					success: function(ct) {

						typeof args.beforeRender === 'function' && args.beforeRender(ct);

						var fieldData = '';
						if(args.field) {
							if(args.field2) {
								fieldData = ct[args.field][args.field2];
							} else {
								fieldData = ct[args.field];
							}
						} else {
							fieldData = ct;
						}
						console.log(JSON.stringify(fieldData, null, 2) + ',fieldData')
						if(fieldData instanceof Array && fieldData.length != 0) {
							$api.append($api.dom(args.container || '#main'), doT.template($api.html($api.dom('[template=' + (args.template || 'list') + ']')))(fieldData));
							api.parseTapmode();
							if(typeof args.success === 'function') {
								args.success(ct, selfValues.page);
							}
						} else {
							api.toast({
								msg: 'No more content.',
								location: 'bottom',
								duration: 2000
							});
						}
					}
				});
			});
		}
	};
	window.LoadMore = c;
}(window);

/**
 * 2016-09-25
 */

/**
 * @author          连接科技
 * @description     封装photoBrowser模块常用方法
 * @namespace       PhotoBrowser
 * @version         1.0.0
 */

! function(window) {
	var pb = {
		open: function(args) {
			/**
			 * 打开图片浏览器后的回调事件
			 * @callback    showCallback
			 *
			 * 用户切换图片的回调事件
			 * @callback    changeCallback
			 * @param       {number}              index - 当前图片在图片路径数组中的索引
			 *
			 * 用户单击图片浏览器的回调事件
			 * @callback    clickCallback
			 * @param       {number}              index - 当前图片在图片路径数组中的索引
			 *
			 * 网络图片下载成功的回调事件
			 * @callback    loadImgSuccessCallback
			 * @param       {number}              index - 当前图片在图片路径数组中的索引
			 *
			 * 网络图片下载失败的回调事件
			 * @callback    loadImgFailCallback
			 * @param       {number}              index - 当前图片在图片路径数组中的索引
			 *
			 * 用户长按图片的回调事件
			 * @callback    longPressCallback
			 * @param       {number}              index - 当前图片在图片路径数组中的索引
			 */

			/**
			 * 打开图片浏览器
			 * @method      open
			 * @memberof    PhotoBrowser
			 * @param       {object}          args
			 * @param       {object[]}        args.images - 要读取的图片路径组成的数组，图片路径支持 fs://、http:// 协议
			 * @param       {number}          [args.activeIndex=0] - 当前要显示的图片在图片路径数组中的索引
			 * @param       {string}          args.placeholderImg - 当加载网络图片时显示的占位图路径，要求本地图片路径（widget://、fs://）
			 * @param       {string}          [args.bgColor=#000] - 图片浏览器背景色，支持 rgb、rgba、#
			 * @param       {boolean}         [args.zoomEnabled=true] - 是否打开缩放手势识别功能（随手势放大缩小图片）
			 * @param       {showCallback}              打开图片浏览器后的回调事件
			 * @param       {changeCallback}            用户切换图片的回调事件
			 * @param       {clickCallback}             用户单击图片浏览器的回调事件
			 * @param       {loadImgSuccessCallback}    网络图片下载成功的回调事件
			 * @param       {loadImgFailCallback}       网络图片下载失败的回调事件
			 * @param       {longPressCallback}         用户长按图片的回调事件
			 */
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.open({
				images: args.images,
				activeIndex: args.activeIndex || 0,
				placeholderImg: args.placeholderImg || '',
				bgColor: args.bgColor || '#000',
				zoomEnabled: typeof args.zoomEnabled == 'boolean' ? args.zoomEnabled : true
			}, function(ret, err) {
				switch(ret.eventType) {
					case 'show':
						if(typeof args.show === 'function') {
							args.show();
						}
						break;
					case 'change':
						if(typeof args.change === 'function') {
							args.change(ret.index);
						}
						break;
					case 'click':
						if(typeof args.click === 'function') {
							args.click(ret.index);
						}
						break;
					case 'loadImgSuccess':
						if(typeof args.loadImgSuccess === 'function') {
							args.loadImgSuccess(ret.index);
						}
						break;
					case 'loadImgFail':
						if(typeof args.loadImgFail === 'function') {
							args.loadImgFail(ret.index);
						}
						break;
					case 'longPress':
						if(typeof args.longPress === 'function') {
							args.longPress(ret.index);
						}
						break;
				}
			});
		},
		close: function() {
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.close();
		},
		show: function() {
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.show();
		},
		hide: function() {
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.hide();
		}
	};

	window.PhotoBrowser = pb;
}(window);

/*privacy 模块封装了 IOS 平台上设备访问权限判断的接口，包括定位服务、通讯录、日历、
 * 提醒事项、照片、蓝牙共享、麦克风、相机。
 * 由于 Android 平台上机制不同，所以本模块仅支持 IOS 平台。
 * （Android 上是在应用打包时候注册某一项权限，用户安装时系统弹出提示，
 * 若用户同意则安装该 app，若不同意则取消安装。所以若应用被安装成功，
 * 则必定有 app 开发者注册给该应用的权限，应用内无需判断。）
 *
 * 注意：本模块仅支持IOS，android无须判断。
 */

! function(window) {
	var p = {
		/*以下各方法中，args的内部结构
		 *success 有该权限的回调
		 *forbid 无该权限的回调
		 */
		location: function(args) {
			/*判断是否有定位权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.location(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		contacts: function(args) {
			/*判断是否有访问联系人权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.contacts(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		calendars: function(args) {
			/*判断是否有访问日历权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.calendars(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		reminders: function(args) {
			/*判断是否有访问提醒事项的权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.reminders(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		photos: function(args) {
			/*判断是否有访问相册的权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.photos(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		bluetooth: function(args) {
			/*判断是否有访问蓝牙的权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.bluetooth(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		microphone: function(args) {
			/*判断是否有访问录音器的权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.microphone(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
		camera: function(args) {
			/*判断是否有访问摄像头的权限
			 */
			var privacy = api.require('privacy');
			if(api.systemType === 'ios') {
				privacy.camera(function(ret, err) {
					if(ret.status) {
						args.success();
					} else {
						args.forbid();
					}
				});
			}
		},
	};
	window.Privacy = p;
}(window);

/**
 * 打开新页面
 */

! function(window) {
	var openPage = {};
	window.o = openPage;
}(window);

/**
 * @description 在storage里获取memberinfo
 */
function getMemberInfoFromStorage() {
	return $api.getStorage(CONFIG.KEY.MEMBER_INFO);
}
/**
 * @description 在storage里设置memberinfo
 */
function setMemberInfoFromStorage(m) {
	$api.setStorage(CONFIG.KEY.MEMBER_INFO, m);
}
/**
 * @description 在storage里获取memberid
 */
function getMemberIdFromStorage() {
	return $api.getStorage(CONFIG.KEY.MEMBER_ID);
}
/**
 * @description 在storage里获取membertoken
 */
function getMemberTokenFromStorage() {
	return $api.getStorage(CONFIG.KEY.TOKEN);
}
/**
 * @description 克隆对象并合并对象
 * @param {Object} object1 要克隆的对象
 * @param {Object} object2 要合并的对象
 */
function assign(object1, object2) {
	var obj1 = JSON.parse(JSON.stringify(object1));
	if(typeof object2 == 'object') {
		for(var i in object2) {
			obj1[i] = object2[i];
		}
	}
	return obj1;
}

//将键盘收下来
function inputBlur() {
	if($api.dom('input')) {
		var inputs = $api.domAll('input');
		for(var i = 0, len = inputs.length; i < len; i++) {
			inputs[i].blur();
		}
	}
	if($api.dom('textarea')) {
		var textareas = $api.domAll('textarea');
		for(var i = 0, len = textareas.length; i < len; i++) {
			textareas[i].blur();
		}
	}
}
//防止点击冒泡
function stopPropagation(e, callback) {
	e.stopPropagation();
	typeof callback == 'function' && callback();
}

//除去七牛地址
function picPath(path) {
	if(!path) return;
	if(path.indexOf('/') == -1) return path;
	var strs = new Array();
	strs = path.split('/');
	return strs[strs.length - 1];
}

/*格式化距离*/
function formatDistance(d) {
	if(typeof d === 'string') {
		d = parseInt(d);
	}
	if(d > 1000) {
		return parseInt(d / 1000) + ' km';
	} else {
		return d + ' m';
	}
}
//goolgle地图定位
function openMap(location) {
	var GoogleMap = api.require('googleMap');
	var rect = $api.offset($api.dom('.map'));
	rect = {
		x: rect.l,
		y: rect.t,
		w: rect.w,
		h: rect.h
	}
	GoogleMap.open({
		rect: rect,
		showUserLocation: false,
		zoomLevel: 10,
		center: {
			lon: location.y,
			lat: location.x,
			//			        lon: 116.233,
			//  				lat: 39.134,
		},
		fixedOn: api.frameName,
		fixed: false
	}, function(ret) {
		if(ret.status) {}
	});
	GoogleMap.addAnnotations({
		annotations: [{
			id: 1,
			lon: location.y,
			lat: location.x,
			//			        lon: 116.233,
			//  				lat: 39.134,
		}],
		icons: ['widget://image/browse/didian11.png'],
		icon: 'widget://image/browse/didian11.png',
		draggable: true,
	});
}

/**
 * @param {Number} type = [0|1|2|3] 0： 4周	1:3个月	2：6个月		3:12个月
 * @param {Number} type2 = [1|2|3]	1:3个月	2：6个月		3:12个月
 */
function getTimeRange(type, type2) {
	var time2 = new Date();
	var time1 = new Date();
	var m = 12;
	if(type2) {
		if(type2 == 1) {
			m = 3;
		} else if(type2 == 2) {
			m = 6;
		}
		if(type == 1) {
			time2.setMonth(time2.getMonth() - 3);
			time1.setMonth(time2.getMonth() - (m - 3));
		} else if(type == 2) {
			time2.setMonth(time2.getMonth() - 6);
			time1.setMonth(time2.getMonth() - (m - 6));
		}
	} else {
		if(type == 0) {
			time1.setDate(time1.getDate() - 28);
		} else {
			if(type == 1) {
				m = 3;
			} else if(type == 2) {
				m = 6;
			}
			time1.setMonth(time1.getMonth() - m);
		}
	}
	return {
		time1: Tool.formatDate(time1, 'YMD'),
		time2: Tool.formatDate(time2, 'YMD')
	}
}

function openCitySelector() {
	inputBlur();
	UIActionSelector.open({
		actives: curCity.city.index ? [curCity.country.index, curCity.province.index, curCity.city.index] : '',
		success: function(ret) {
			var selectedInfo = ret.selectedInfo;
			curCity = Area.getCityName(selectedInfo[0].value, selectedInfo[1].value, selectedInfo[2].value);
			$api.text($api.dom('#city'), curCity.city.name);
			$api.text($api.dom('#province'), curCity.province.name);
		}
	})
}

//极光推送
function jpush(tags, callback) {
	var id = getMemberIdFromStorage();
	var alias = id;
	var param = {
		alias: alias,
		tags: tags
	};
	//	Debug.alt(JSON.stringify(param))
	JPush.init(function(ret) {
		//		Debug.alt('初始化成功!');
		JPush.bindAliasAndTags(param, function() {
			//			Debug.alt('绑定别名成功')
			JPush.getRegistrationId(function(ret) {
				//console.log('绑定jpush成功RegistrationId:' + JSON.stringify(ret))
				if(ret && ret.id) {
					updateRegistrationId(ret.id, callback);
				}
			});
		});
		JPush.setListener(function(ret) {
			console.log('收到推送:"-' + JSON.stringify(ret, null, 2));
			jpushListen(ret);
		});
		JPush.getDataByTouchNotification(function(ret) {
			// console.log(':----------' + JSON.stringify(ret));
			if(ret && ret.content) {
				api.execScript({
					name: 'Notifications',
					frameName: 'notifications',
					script: 'refresh();'
				});
				/**
				 * 任务状态:0:未支付,1:发布中,2:进行中,3:帮组者完成,4：发布者完成,5:完成并且评价完3和4都是完成
				 *  isself=1是帮助者 isself=2是发布者
				 * */
				Tool.openWin({
					winName: 'Notifications',
					winUrl: api.wgtRootDir + '/html/window/win.html',
					title: LANGUAGE[$api.getStorage('lan')]['Notifications'],
					frameName: 'notifications',
					frameUrl: api.wgtRootDir + '/html/more/notifications.html'
				});
			}
		});
	});
}

//同步服务器regid
function updateRegistrationId(rid, callback, showProgress) {
	if(getMemberIdFromStorage() && getMemberTokenFromStorage()) {
		ajax.get({
			ctrl: 'common',
			fn: 'updateRegistrationId',
			data: {
				values: {
					id: getMemberIdFromStorage(),
					token: getMemberTokenFromStorage(),
					rid: rid
				}
			},
			showProgress: showProgress ? true : false,
			showError: true,
			hideLoading: true,
			success: function() {
				if(typeof callback == 'function') {
					callback();
				}
			}
		});
	}
}

//极光推送监听
function jpushListen(ret) {

	if(ret) {
		if(ret.extra && ret.extra._j_uid){
			return;
		}
		console.log(JSON.stringify(ret, null, 2) + '  pol极光推送监听')
		api.sendEvent({
			name: 'getNewMsg',
			extra: ret
		});

		var notify;

		if(CONFIG.IS_SHOW_NOTIFY){
			if(api.systemType == 'ios'){
				notify = {
					content: ret.content || 'You have a new message.',
					extra: ret
				}
			}
		}
		api.notification({
			vibrate: [500, 500],
			sound: 'default',
			notify: notify,
			light: api.systemType == 'ios' ? false : true
		});
	}
}
