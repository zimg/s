/** 
 *  
 * jQuery上下滚动插件
 * @name scrollQ.js
 * @date 2017-08-02 
 * line 显示li行数 
 * scrollNum 每次滚动li行数
 * scrollTime 滚动速度 单位毫秒
 * 
 */ 
(function($){  
    var status = false;  
    $.fn.scrollQ = function(options){
    	options = jQuery.extend( { line:10, scrollNum:2, scrollTime:5000 },options);
		var _self = this;
		return this.each(function(){  
			$("li",this).each(function(){ $(this).css("display","none"); });
			$("li:lt("+options.line+")",this).each(function(){ $(this).css("display","block");  });
			function scroll() {
				for(var i=0;i<options.scrollNum;i++) {
					var start=$("li:first",_self);
					start.fadeOut(100);
					start.css("display","none");
					start.appendTo(_self);
					$("li:eq("+(options.line-1)+")",_self).each(function(){
						$(this).fadeIn(500);
						$(this).css("display","block");
					})
				}
			}
			var timer = setInterval(scroll,options.scrollTime);
			_self.bind("mouseover",function(){ clearInterval(timer); });
			_self.bind("mouseout",function(){ timer = setInterval(scroll,options.scrollTime); });
		});
    };
    if($("#sItem").length>0){$("#sItem").scrollQ();}else{return;}
})(jQuery);
