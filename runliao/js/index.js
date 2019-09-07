$(function () {
    var sliderEl = $('.j-slider');
    var sliderInfoEl = $('.j-slider-info');
    var dotTimer;
    sliderEl.unslider({
        complete: function (slider) {
            var data = slider.data('unslider');
            var item = data.items.eq(data.current);
            sliderInfoEl.find('h4').html('<a href="' + item.find('a').attr('href') + '">' + item.data('title') + '</a>');
            sliderInfoEl.find('p').text(item.data('info'));
        },
        delay: 5000,
        dots: true
    }).on('click', '.prev-btn', function () {
        sliderEl.data('unslider').prev();
    }).on('click', '.next-btn', function () {
        sliderEl.data('unslider').next();
    }).on('mouseenter', '.dots .dot', function () {
        var thisEL = this;
        dotTimer = window.setTimeout(function () {
            $(thisEL).trigger('click');
        }, 400);
    }).on('mouseleave', '.dots .dot', function () {
        dotTimer && window.clearTimeout(dotTimer);
    });

    sliderEl.find('.dots').insertAfter(sliderInfoEl);

    $('.j-views .view').on('mouseenter', function () {
        $(this).addClass('hover');
    }).on('mouseleave', function () {
        $(this).removeClass('hover');
    });


    //喜欢事件绑定 crohn
    var ls = loveSubmit.createNew();
    ls.index();


    $('.j-cata').on('mouseenter', 'li a', function () {
        var subCataEl = $(this).next('.sub-cata');
        if (subCataEl.length && subCataEl.text()) {
            subCataEl.show();
            subCataEl.css({
                left: $(this).offset().left - (subCataEl.width() - $(this).width()) / 2,
                top: $(this).offset().top + $(this).height() - 5
            });
        }
    }).on('mouseleave', 'li a', function () {
        var subCataEl = $(this).next('.sub-cata');
        subCataEl.hide();
    }).on('mouseleave', 'li .sub-cata', function () {
        $(this).hide();
    }).on('mouseenter', 'li .sub-cata', function () {
        $(this).show();
    });
});
