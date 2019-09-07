(function($){

    /*头部样式变换*/
    if($(document).scrollTop() != 0) {
        $('#header').attr('class','header_hover');
    }
    $(window).scroll(function() {
        if($(document).scrollTop() == 0) {
            $('#header').attr('class','header');
        }else{
            if(!$('#header').hasClass('header_hover')){
                $('#header').attr('class','header_hover');
            }
        }
    });

    /*项目简介展示*/
    $('#case_xl').click(function(){
        if($(this).is('.on')){
            $(this).removeClass('on');
            $('#case_txt').removeClass('on');
        }else{
            $(this).addClass('on');
            $('#case_txt').addClass('on');
        }
    });

})(jQuery);



    /*案例切换*/
    var cases = new Swiper('.swiper-cases', {
        pagination: '.clients_pages',
        paginationClickable: true,
        loop: true,
        speed:500,
        autoplay: 4500
    });


    var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.gallery-next',
        prevButton: '.gallery-prev',
        spaceBetween: 10,
    });

    $('.gallery-prev,.thumbs-prev').on('click', function (e) {
        galleryThumbs.swipePrev();
        galleryThumbsImg();
    });

    $('.gallery-next,.thumbs-next').on('click', function (e) {
        galleryThumbs.swipeNext();
        galleryThumbsImg();
    });

    function galleryThumbsImg() {
        var src = $('.thumbs').find('.swiper-slide').eq(galleryThumbs.activeIndex).find('img').attr('src');
        $('.gallery-top').find('img').attr('src', src);
    }


    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        nextButton: '.thumbs-next',
        prevButton: '.thumbs-prev'
    });



    var latest = new Swiper('.swiper-latest', {
        slidesPerView: 3,
        lazyLoading: true,
        loop: true
    });

    var mobile = new Swiper('.swiper-mobile', {
        pagination: '.swiper-pages',
        paginationClickable: true,
    });


    $('.latest-prev').on('click', function(e){
        latest.swipePrev();
        return false;
    });
    $('.latest-next').on('click', function(e){
        latest.swipeNext();
        return false;
    });

    $('.mobile-prev').on('click', function(e){
        mobile.swipePrev();
    });
    $('.mobile-next').on('click', function(e){
        mobile.swipeNext();
    });
    function ChangeFontSize(id, size) {
        $('#' + id + " p,td").css("font-size", size + 'px');
    }

    //div层随屏幕滚动
    //层样式需设置绝对定位position:absolute;
    $(document).ready(function () {
        if ($("#online").size() > 0) {
            mouseScrollFun('online');
        }

    });
    function mouseScrollFun(id) {
        var menuYloc = $("#" + id).offset().top;
        $(window).scroll(function () {
            if ($(window).scrollTop() > menuYloc) {
                $("#" + id).css("position", "absolute");
                var offsetTop = $(window).scrollTop() + 100 + "px";
                $("#" + id).animate({ top: offsetTop }, { duration: 100, queue: false });
            }
            else { $("#" + id).animate({ top: 100 }, { duration: 100, queue: false }); }
        });
    }
    function closeFloatWindow() {
        $("#online_right").hide();
        $("#online").css("width", "32px");
        //$("#smallFloatWindow").show();

    }
    function showFloatWindow() {
        //$("#smallFloatWindow").hide();
        if ($("#online_right").css("display") == "none") {
            $("#online_right").show();
            $("#online").css("width", "151px");
        } else {
            closeFloatWindow();
        }

    }
    function backToTop() {
        $(document).scrollTop(0);
    }