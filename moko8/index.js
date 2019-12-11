//首焦点图
$(function(){
    var $promo1Wrap = $("#promp1");
    var $curLink = $promo1Wrap.find(".cur-link");
    var $curPic = $curLink.find(".top");
    var $curMask = $curLink.find(".mask");
    var $navPics = $promo1Wrap.find(".nav-pics li");

    var timer = false;
    var $activetab = false;


    function activeTab($tab)
    {
        $activetab && $activetab.removeClass("active");
        $activetab = $tab;

        $activetab.addClass("active");
        if($curLink.attr("href") != $tab.find("a").attr("href"))
        {
            $curPic.stop();
            $curPic.removeAttr("style");

            $curPic.fadeOut(0,function(){
                $curLink.attr("href",$tab.find("a").attr("href"));
                $curPic.attr("src",$tab.find("img").attr("bigPic"));
                $curLink.attr("title",'');
                $curPic.attr("alt",'');
                $curMask.attr("alt",'');
                $curPic.fadeIn(800,function(){
                    $curMask.attr("src",$tab.find("img").attr("bigPic"));
                });
                $curLink.attr("title",$tab.find("img").attr("alt"));
                $curPic.attr("alt",$tab.find("img").attr("alt"));
                $curMask.attr("alt",$tab.find("img").attr("alt"));
            });

        }
    }

    //event

    function autoScroll(){
        if(!$activetab)
        {
            activeTab($navPics.eq(0));
        }
        else
        {
            if($activetab && $activetab.next().length)
            {
                activeTab($activetab.next());
            }
            else
            {
                activeTab($navPics.eq(0));
            }
        }
        timer = setTimeout(arguments.callee,3000);


    }//function auto(){


    //events
    $navPics.hover(function(){
        clearTimeout(timer);
        activeTab($(this));
    });
    $promo1Wrap.hover(function(){
        clearTimeout(timer);
    },function(){
        auto();
    });

    //init
    autoScroll();
});

//文字导航
$(function(){
    var $itemWrap = $(".mod-s1 .txt-list");
    $itemWrap.each(function(){
        var $THIS = $(this);
        var $hoverItem=  '';

        function hoverItem($item)
        {
            $hoverItem && $hoverItem.find("img").removeAttr("style") && $hoverItem.removeClass("hover");
            $hoverItem = $item;
            var $curImg = $hoverItem.find("img");
            $hoverItem.addClass('hover');

            if(!$curImg.attr("src") || $curImg.attr("src") != '')
            {
                $curImg.attr("src",$curImg.attr("data-lazy"));
            }
        }

        $THIS.find("li").hover(function(e){
            hoverItem($(this));
        });
        hoverItem($THIS.find("li").eq(0));

    });
});