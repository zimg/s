$(document).ready(function(){
	$(".picbox div").hover(function() {
		// $(this).animate({"top": "-350px"}, 300, "swing");  pic-list-b.png
		$(this).animate({"top": "-350px"}, 0, "swing");
	},function() {
		// $(this).stop(true,false).animate({"top": "0px"}, 300, "swing");  pic-list-b.png
		$(this).stop(true,false).animate({"top": "0px"}, 0, "swing");
	});

    //图片延迟加载
    $("img").lazyload({
        effect : "fadeIn",
        threshold :100
    });
});
