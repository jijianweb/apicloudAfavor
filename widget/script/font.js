//编辑的字体变小
function wayOneLength1(length,remuneration) {
	var s = remuneration + "";
    var str = s.substring(s.indexOf(".")+1,s.indexOf(".")+3);
    var lengths;
    if(str>0){
    	lengths=length;
    }else{
    	lengths= s.substring(0,s.indexOf(".")).length
    }
	if(lengths == 1){
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:86px;')
    }else if(lengths == 2) {
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:80px;')
	} else if(lengths == 3) {
		$api.css($api.dom('.money'), 'font-size:38px')
		$api.css($api.dom('.prices1'), 'width:86px;padding-left: 8px;')
	} else if(lengths == 4) {
		$api.css($api.dom('.money'), 'font-size:36px')
		$api.css($api.dom('.prices1'), 'width:90px;padding-left:8px;')
	} else if(lengths == 5) {
		$api.css($api.dom('.money'), 'font-size:28px')
		$api.css($api.dom('.prices1'), 'width:95px;padding-left: 8px;')
	} else if(lengths == 6) {
		$api.css($api.dom('.money'), 'font-size:24px')
	} else if(lengths == 7) {
		$api.css($api.dom('.money'), 'font-size:20px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 8) {
		$api.css($api.dom('.money'), 'font-size:18px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 9) {
		$api.css($api.dom('.money'), 'font-size:16px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 10) {
		$api.css($api.dom('.money'), 'font-size:14px')
		$api.css($api.dom('.tpmun'), 'width:80px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths >= 11) {
		$api.css($api.dom('.money'), 'font-size:12px')
		$api.css($api.dom('.tpmun'), 'width:80px;')
		$api.css($api.dom('.prices1'), 'width:130px;')
	}
}
function wayOneLength(length) {
	if(length <= 2) {
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:86px;padding-left:0px;')
	} else if(length == 3) {
		$api.css($api.dom('.money'), 'font-size:38px')
		$api.css($api.dom('.prices1'), 'width:86px;padding-left: 8px;')
	} else if(length == 4) {
		$api.css($api.dom('.money'), 'font-size:36px')
		$api.css($api.dom('.prices1'), 'width:90px;padding-left:8px;')
	} else if(length == 5) {
		$api.css($api.dom('.money'), 'font-size:28px')
		$api.css($api.dom('.prices1'), 'width:95px;padding-left: 8px;')
	} else if(length == 6) {
		$api.css($api.dom('.money'), 'font-size:24px')
	} else if(length == 7) {
		$api.css($api.dom('.money'), 'font-size:20px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 8) {
		$api.css($api.dom('.money'), 'font-size:18px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 9) {
		$api.css($api.dom('.money'), 'font-size:16px')
		$api.css($api.dom('.tpmun'), 'width:95px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 10) {
		$api.css($api.dom('.money'), 'font-size:14px')
		$api.css($api.dom('.tpmun'), 'width:80px;')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length >= 11) {
		$api.css($api.dom('.money'), 'font-size:12px')
		$api.css($api.dom('.tpmun'), 'width:80px;')
		$api.css($api.dom('.prices1'), 'width:130px;')
	}
}



function wayTwoLength1(timelength, moenylength,remuneration1) {
	var s = remuneration1 + "";
    var str = s.substring(s.indexOf(".")+1,s.indexOf(".")+3);
    var lengths;
    if(str>0){
    	lengths=moenylength;
    }else{
    	lengths= s.substring(0,s.indexOf(".")).length
    }
	if(timelength >= 7) {
		$api.css($api.dom('.hhour'), 'font-size:14px;')
		$api.css($api.dom('.pr2'), 'width: 100px;')
	} else if(timelength == 6) {
		$api.css($api.dom('.hhour'), 'font-size:12px;')
		$api.css($api.dom('.pr2'), 'width: 97px;')
	} else if(timelength == 5) {
		$api.css($api.dom('.hhour'), 'font-size: 24px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength == 4) {
		$api.css($api.dom('.hhour'), 'font-size: 30px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength <= 3) {
		$api.css($api.dom('.hhour'), 'font-size: 36px;')
		$api.css($api.dom('.pr2'), 'width:85px;')
	}
	if(lengths >= 7) {
		$api.css($api.dom('.hmoney'), 'font-size:14px;')
		$api.css($api.dom('.pr3'), 'width:90px;')
	} else if(lengths == 6) {
		$api.css($api.dom('.hmoney'), 'font-size:18px;')
		$api.css($api.dom('.pr3'), 'width:90px;')
	} else if(lengths == 5) {
		$api.css($api.dom('.hmoney'), 'font-size:24px;')
		$api.css($api.dom('.pr3'), 'width:85px;')
	} else if(lengths == 4) {
		$api.css($api.dom('.hmoney'), 'font-size:30px;')
		$api.css($api.dom('.pr3'), 'width:75px;')
	} else if(lengths == 3) {
		$api.css($api.dom('.hmoney'), 'font-size: 34px;')
		$api.css($api.dom('.pr3'), 'width:60px;')
	}else if(lengths<=2){
		$api.css($api.dom('.hmoney'), 'font-size: 36px;')
		$api.css($api.dom('.pr3'), 'width:55px;')
	}
}
function wayTwoLength(timelength, moenylength) {
	if(timelength >= 7) {
		$api.css($api.dom('.hhour'), 'font-size:14px;')
		$api.css($api.dom('.pr2'), 'width: 90px;')
	} else if(timelength == 6) {
		$api.css($api.dom('.hhour'), 'font-size:12px;')
		$api.css($api.dom('.pr2'), 'width: 97px;')
	} else if(timelength == 5) {
		$api.css($api.dom('.hhour'), 'font-size: 24px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength == 4) {
		$api.css($api.dom('.hhour'), 'font-size: 30px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength <= 3) {
		$api.css($api.dom('.hhour'), 'font-size: 36px;')
		$api.css($api.dom('.pr2'), 'width:85px;')
	}
	if(moenylength >= 7) {
		$api.css($api.dom('.hmoney'), 'font-size:14px;')
		$api.css($api.dom('.pr3'), 'width:100px;')
	} else if(moenylength == 6) {
		$api.css($api.dom('.hmoney'), 'font-size:18px;')
		$api.css($api.dom('.pr3'), 'width:90px;')
	} else if(moenylength == 5) {
		$api.css($api.dom('.hmoney'), 'font-size:24px;')
		$api.css($api.dom('.pr3'), 'width:85px;')
	} else if(moenylength == 4) {
		$api.css($api.dom('.hmoney'), 'font-size:30px;')
		$api.css($api.dom('.pr3'), 'width:75px;')
	} else if(moenylength == 3) {
		$api.css($api.dom('.hmoney'), 'font-size: 34px;')
		$api.css($api.dom('.pr3'), 'width:60px;')
	}else if(moenylength<=2){
		$api.css($api.dom('.hmoney'), 'font-size: 36px;')
		$api.css($api.dom('.pr3'), 'width:55px;')
	}
}
//发布字体大小
function postFontOne(length) {
	if(length <= 3) {
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.pr1'), 'width:86px;')
	} else if(length == 4) {
		$api.css($api.dom('.money'), 'font-size:36px')
		$api.css($api.dom('.pr1'), 'width: 90px;')
	} else if(length == 5) {
		$api.css($api.dom('.money'), 'font-size:26px')
		$api.css($api.dom('.pr1'), 'width: 95px;')
	} else if(length == 6) {
		$api.css($api.dom('.money'), 'font-size:24px')
		$api.css($api.dom('.pr1'), 'width: 95px;')
	} else if(length == 7) {
		$api.css($api.dom('.money'), 'font-size:20px')
		$api.css($api.dom('.pr1'), 'width:95px;')
	} else if(length == 8) {
		$api.css($api.dom('.money'), 'font-size:18px')
		$api.css($api.dom('.pr1'), 'width:95px;')
	} else if(length == 9) {
		$api.css($api.dom('.money'), 'font-size:16px')
		$api.css($api.dom('.pr1'), 'width: 100px;')
	} else if(length == 10) {
		$api.css($api.dom('.money'), 'font-size:14px')
		$api.css($api.dom('.pr1'), 'width: 100px;')
	} else if(length >= 11) {
		$api.css($api.dom('.money'), 'font-size:12px')
		$api.css($api.dom('.pr1'), 'width: 130px;')
	}
}

function postFontTwo(timelength, moenylength) {
	if(timelength >= 11) {
		$api.css($api.dom('.hour'), 'font-size:12px;')
		$api.css($api.dom('.htext'), 'width: 89px;')
	} else if(timelength == 10) {
		$api.css($api.dom('.hour'), 'font-size: 14px;')
	} else if(timelength == 9) {
		$api.css($api.dom('.hour'), 'font-size: 16px;')
	} else if(timelength == 8) {
		$api.css($api.dom('.hour'), 'font-size: 18px;')
		$api.css($api.dom('.htext'), 'width:93px;')
	} else if(timelength == 7) {
		$api.css($api.dom('.hour'), 'font-size: 20px;')
		$api.css($api.dom('.htext'), 'width:87px;')
	} else if(timelength == 6) {
		$api.css($api.dom('.hour'), 'font-size: 22px;')
		$api.css($api.dom('.htext'), 'width:85px;')
	} else if(timelength == 5) {
		$api.css($api.dom('.hour'), 'font-size: 26px;')
		$api.css($api.dom('.htext'), 'width:80px;')
	} else if(timelength == 4) {
		$api.css($api.dom('.hour'), 'font-size: 28px;')
		$api.css($api.dom('.htext'), 'width:75px;')
	} else if(timelength == 3) {
		$api.css($api.dom('.hour'), 'font-size: 34px;')
		$api.css($api.dom('.htext'), 'width:70px;')
	} else if(timelength <= 2) {
		$api.css($api.dom('.hour'), 'font-size: 36px;')
		$api.css($api.dom('.htext'), 'width:50px;')
	}

	if(moenylength >= 11) {
		$api.css($api.dom('.h-m'), 'font-size:12px;')
		$api.css($api.dom('.prices1'), 'width: 90px;')
	} else if(moenylength == 10) {
		$api.css($api.dom('.h-m'), 'font-size:14px;')
		$api.css($api.dom('.prices1'), 'width: 89px;')
	} else if(moenylength == 9) {
		$api.css($api.dom('.h-m'), 'font-size:16px;')
		$api.css($api.dom('.prices1'), 'width: 85px;')
	} else if(moenylength == 8) {
		$api.css($api.dom('.h-m'), 'font-size:18px;')
		$api.css($api.dom('.prices1'), 'width: 83px;')
	} else if(moenylength == 7) {
		$api.css($api.dom('.h-m'), 'font-size:20px;')
		$api.css($api.dom('.prices1'), 'width: 80px;')
	} else if(moenylength == 6) {
		$api.css($api.dom('.h-m'), 'font-size:22px;')
		$api.css($api.dom('.prices1'), 'width: 80px;')
	} else if(moenylength == 5) {
		$api.css($api.dom('.h-m'), 'font-size:24px;')
		$api.css($api.dom('.prices1'), 'width:73px;')
	} else if(moenylength == 4) {
		$api.css($api.dom('.h-m'), 'font-size:30px;')
		$api.css($api.dom('.prices1'), 'width: 70px;')
	} else if(moenylength == 3) {
		$api.css($api.dom('.h-m'), 'font-size:34px;')
		$api.css($api.dom('.prices1'), 'width:70px;')
	} else if(moenylength <= 2) {
		$api.css($api.dom('.h-m'), 'font-size: 36px;')
		$api.css($api.dom('.prices1'), 'width: 65px;')
	}
}
//没有申请者的编辑任务详情
function editOne(length){
	//ishours是否按小时收费,0为否，1为是 
	if(length <= 2) {
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:86px;padding-left:0px;')
	} else if(length == 3) {
		$api.css($api.dom('.money'), 'font-size:38px')
		$api.css($api.dom('.prices1'), 'width:86px;')
	} else if(length == 4) {
		$api.css($api.dom('.money'), 'font-size:34px')
		$api.css($api.dom('.prices1'), 'width:90px;')
	} else if(length == 5) {
		$api.css($api.dom('.money'), 'font-size:28px')
		$api.css($api.dom('.prices1'), 'width:95px;')
	} else if(length == 6) {
		$api.css($api.dom('.money'), 'font-size:24px')
	} else if(length == 7) {
		$api.css($api.dom('.money'), 'font-size:20px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 8) {
		$api.css($api.dom('.money'), 'font-size:18px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 9) {
		$api.css($api.dom('.money'), 'font-size:16px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length == 10) {
		$api.css($api.dom('.money'), 'font-size:14px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(length >= 11) {
		$api.css($api.dom('.money'), 'font-size:12px')
		$api.css($api.dom('.prices1'), 'width:130px;padding-right: 15px')
	}
}
//没有申请者的编辑任务详情
function editOne1(length,cash){
	var s = cash + "";
    var str = s.substring(s.indexOf(".")+1,s.indexOf(".")+3);
    var lengths;
    if(str>0){
    	lengths=length;
    }else{
    	lengths= s.substring(0,s.indexOf(".")).length
    }
	//ishours是否按小时收费,0为否，1为是 
	if(lengths == 1){
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:60px;padding-left:10px;')
    }else if(lengths == 2) {
		$api.css($api.dom('.money'), 'font-size:50px')
		$api.css($api.dom('.prices1'), 'width:70px;')
	} else if(lengths == 3) {
		$api.css($api.dom('.money'), 'font-size:38px')
		$api.css($api.dom('.prices1'), 'width:86px;')
	} else if(lengths == 4) {
		$api.css($api.dom('.money'), 'font-size:34px')
		$api.css($api.dom('.prices1'), 'width:90px;')
	} else if(lengths == 5) {
		$api.css($api.dom('.money'), 'font-size:28px')
		$api.css($api.dom('.prices1'), 'width:95px;')
	} else if(lengths == 6) {
		$api.css($api.dom('.money'), 'font-size:24px')
	} else if(lengths == 7) {
		$api.css($api.dom('.money'), 'font-size:20px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 8) {
		$api.css($api.dom('.money'), 'font-size:18px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 9) {
		$api.css($api.dom('.money'), 'font-size:16px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths == 10) {
		$api.css($api.dom('.money'), 'font-size:14px')
		$api.css($api.dom('.prices1'), 'width:100px;')
	} else if(lengths >= 11) {
		$api.css($api.dom('.money'), 'font-size:12px')
		$api.css($api.dom('.prices1'), 'width:130px;padding-right: 15px')
	}
}
function editTwo(timelength,moenylength){
	//ishours是否按小时收费,0为否，1为是 
	if(timelength >= 7) {
		$api.css($api.dom('.hhour'), 'font-size:14px;')
		$api.css($api.dom('.pr2'), 'width: 100px;')
	} else if(timelength == 6) {
		$api.css($api.dom('.hhour'), 'font-size:18px;')
		$api.css($api.dom('.pr2'), 'width: 97px;')
	} else if(timelength == 5) {
		$api.css($api.dom('.hhour'), 'font-size: 24px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength == 4) {
		$api.css($api.dom('.hhour'), 'font-size: 28px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength <= 3) {
		$api.css($api.dom('.hhour'), 'font-size: 36px;')
		$api.css($api.dom('.pr2'), 'width:90px;')
	}
	if(moenylength >= 7) {
		$api.css($api.dom('.hmoney'), 'font-size:14px;')
		$api.css($api.dom('.pr3'), 'width:100px;')
	} else if(moenylength == 6) {
		$api.css($api.dom('.hmoney'), 'font-size:18px;')
		$api.css($api.dom('.pr3'), 'width:90px;')
	} else if(moenylength == 5) {
		$api.css($api.dom('.hmoney'), 'font-size:24px;')
		$api.css($api.dom('.pr3'), 'width:85px;')
	} else if(moenylength == 4) {
		$api.css($api.dom('.hmoney'), 'font-size:30px;')
		$api.css($api.dom('.pr3'), 'width:75px;')
	} else if(timelength <= 3) {
		$api.css($api.dom('.hmoney'), 'font-size: 36px;')
		$api.css($api.dom('.pr3'), 'width:65px;')
	}
}
function editTwo1(timelength,moenylength,remunerations){
	var s = remunerations + "";
    var str = s.substring(s.indexOf(".")+1,s.indexOf(".")+3);
    var lengths;
    if(str>0){
    	lengths=moenylength;
    }else{
    	lengths= s.substring(0,s.indexOf(".")).length
    }
	//ishours是否按小时收费,0为否，1为是 
	if(timelength >= 7) {
		$api.css($api.dom('.hhour'), 'font-size:14px;')
		$api.css($api.dom('.pr2'), 'width: 100px;')
	} else if(timelength == 6) {
		$api.css($api.dom('.hhour'), 'font-size:18px;')
		$api.css($api.dom('.pr2'), 'width: 97px;')
	} else if(timelength == 5) {
		$api.css($api.dom('.hhour'), 'font-size: 24px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength == 4) {
		$api.css($api.dom('.hhour'), 'font-size: 28px;')
		$api.css($api.dom('.pr2'), 'width: 95px;')
	} else if(timelength <= 3) {
		$api.css($api.dom('.hhour'), 'font-size: 36px;')
		$api.css($api.dom('.pr2'), 'width:90px;')
	}
	if(lengths >= 7) {
		$api.css($api.dom('.hmoney'), 'font-size:14px;')
		$api.css($api.dom('.pr3'), 'width:100px;')
	} else if(lengths == 6) {
		$api.css($api.dom('.hmoney'), 'font-size:18px;')
		$api.css($api.dom('.pr3'), 'width:90px;')
	} else if(lengths == 5) {
		$api.css($api.dom('.hmoney'), 'font-size:24px;')
		$api.css($api.dom('.pr3'), 'width:85px;')
	} else if(lengths == 4) {
		$api.css($api.dom('.hmoney'), 'font-size:30px;')
		$api.css($api.dom('.pr3'), 'width:75px;')
	} else if(lengths <= 3) {
		$api.css($api.dom('.hmoney'), 'font-size: 36px;')
		$api.css($api.dom('.pr3'), 'width:65px;')
	}
}