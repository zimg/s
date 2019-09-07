!function ($, W, D, undefined) {
    W.df = {
        $id: $('.wrap'), //ID节点;
        $head: $('header'), //顶部标题栏;
        $fly_tag: $('footer .upfloat'), //底部悬浮层;
        pg: [0, 0], //存放页面宽高数值;
        em: 0, //基础值;
        mob: /Mobile|Browser/i.test(navigator.userAgent), //判断是否为移动浏览器;
        hdapp: /LEHA|HEALTH/i.test(navigator.userAgent), //是否在润疗养生原生APP应用中;
        ready: function (fn) { //页面装载可执行JS方法;
            $(function () {
                setTimeout(function () {
                    $.type(fn) === 'function' && fn();
                    return;
                }, 300);
            });
        },
        size: function () { //尺寸初始化或重构;
            setTimeout(function () {
                df.pg[0] = W.innerWidth; //获取窗口宽度;
                if (df.pg[0] > 640) df.pg[0] = 640; //640以上的宽度处理;
                df.pg[1] = W.innerHeight; //获取窗口高度;
                var rem = df.em = df.pg[0] / 32; //初始化REM值;
                if (em_basic != rem) {
                    $('html').css({'font-size': rem + 'px'}); // 字体大小初始化;
                    em_basic = rem;
                }
                (Math.abs(W.orientation) == 90 || df.pg[0] > df.pg[1]) ? $('.wrap').css({
                    'height': 'auto',
                    "min-height": df.pg[0] + 'px'
                }) : df.$id.css({'height': 'auto', 'min-height': df.pg[1] + 'px'}); //主容器高度初始化;
                if (df.$fly_tag.length >= 1) df.$fly_tag.show();
                return;
            }, 100);
        },
        header_judge: function () { //顶部标题栏处理;
            if (df.hdapp && df.$head.length > 0 && !df.$head.is('.free')) {
                df.$head.hide();
            }
            return;
        },
        backtop: function () {
            var backup = $('.ico-backup'), $magnet = $('.magnet'), sys = $(W);
            if (backup.length < 1) return;
            if ($magnet.length > 0) {
                var hex = $magnet.find('.ico-backup').parent('a');
                hex.add($('.ico-hongbao')).hide();
                $magnet.animate({'right': '0.5rem'}, 600);
                sys.scroll(function () {
                    var selfup = $(this).scrollTop();
                    if (selfup > df.pg[1] << .5) {
                        hex.add($('.ico-hongbao')).show()
                    } else {
                        hex.add($('.ico-hongbao')).hide()
                    }
                });
            }
            backup.parent().on('click', function () {
                $('html,body').animate({scrollTop: 1}, 400);
                return
            });
            $('.ico-hongbao').on('click', function () {
                df.dialogGet();
                $(this).remove();
                return
            });
        },
        init: function () { //初始化;
            var $load = $('#loading');
            df.header_judge(); //头部判断;
            df.size(); //初始化数值;
            $load.hide();
            $load.remove(); //去掉加载过渡层;
            df.backtop();
            //$(W).on("onorientationchange" in W?"orientationchange":"resize",function(){if(df.pg[0] != W.innerWidth)location.replace(location.href)}); //手机转屏或屏莫尺寸变更处理;
            return;
        },
        clipboard: function (id1, id2) {
            var fooText = $(id1).text();
            var clipboard = new Clipboard(id2);
            clipboard.on('success', function (e) {
                alert("复制成功");
                e.clearSelection();
            });
        },
        search: function (fn, callback) {
            var $obj = [$('.search_input_box'), $('.rti .evade'), $('.push'), null, null, null, null],
                $atag = $('.tag > a');
            if (!$obj[0].length || !$obj[1].length || !$obj[2].length) return;
            $obj[3] = $obj[0].children('.ico-search');
            $obj[4] = $obj[0].children('input');
            $obj[5] = $obj[0].children('.ico-close');
            $obj[6] = $obj[1].parent().children('.btn');
            $obj[4].on('focus', function () {
                $obj[6].removeClass('evade').siblings().addClass('evade')
            }).on('keyup', function () {
                if ($obj[4].val()) {
                    $obj[5].show();
                } else {
                    $obj[5].hide();
                    $obj[2].html("");
                }
                if ($obj[6].is(':hidden')) $obj[6].removeClass('evade').siblings().addClass('evade');
                $.type(fn) === "function" && fn($obj[4].val(), $obj[2])
            }).on('blur', function () {
                if (!$obj[4].val()) {
                    $obj[6].addClass('evade').siblings().removeClass('evade');
                }
            });
            $obj[5].on('click', function () {
                $obj[4].val('');
                $obj[5].hide();
                $obj[6].addClass('evade').siblings().removeClass('evade');
                $obj[2].html("")
            });
            $obj[6].add($obj[3]).on('click', function () {
                if (!$obj[4].val()) return;
                $.type(callback) === "function" && callback($obj[4].val());
            });
            $('.push > li').live('click', function () {
                $obj[4].val($(this).text());
                $obj[2].html("");
                $.type(callback) === "function" && callback($obj[4].val());
            });
            $atag.on('click', function () {
                var valkey = $(this).text();
                $obj[4].val(valkey);
                $.type(callback) === "function" && callback(valkey);
            });
        },
        prevent: function (e) {
            e.preventDefault();
            return
        }, //取消事件的默认行为(内部方法);
        // prevent： true,
        slidemove: function (obj, value, timer) { //滑动移动效果(内部方法);
            obj.css({
                '-webkit-transform': 'translate3d(' + (-1 * value) + 'px,0px,0px)',
                '-webkit-transition-duration': timer + 'ms',
                'transform': 'translate3d(' + (-1 * value) + 'px,0px,0px)',
                'transition-duration': timer + 'ms'
            });
            return
        },
        oslide: function () { //幻灯片
            var $obj = $('.slide_bar'),
                node = [$obj.find('.slide_dot b'), $obj.find('.slide_ul'), $obj.find('.slide_dot'), 0], idx = 0,
                mov = [0, 0, 0], touch = [0, 0, 0, 0, 0, 0], atag = [0, 0, 0, 0], wid = $obj.width(),
                lock = [0, 0, 0, 0];
            if (!$obj.length || (node[0].length != node[1].children('ul').length)) return;
            node[1].children('ul').width($obj.width());
            mov[1] = node[1].children('ul').width();
            mov[0] = mov[1] * node[1].children('ul').length;
            node[1].width(mov[0]);
            atag[0] = node[2].children('p');
            atag[1] = node[2].find('b');
            for (var i = atag[1].length - 1; i >= 0; i--) atag[2] += atag[1].eq(i).width() + 6;
            if (atag[2] <= mov[1]) {
                node[1].on('touchstart', function (e) { //图片区域处理;
                    if (lock[0]) return;
                    touch[0] = e.originalEvent.changedTouches[0].pageX || 0;
                    lock[2] = e.originalEvent.changedTouches[0].pageY || 0;
                    lock[0] = 2;
                }).on('touchmove', function (e) {
                    if (lock[0] != 2) return;
                    touch[1] = e.originalEvent.changedTouches[0].pageX || 0;
                    lock[3] = e.originalEvent.changedTouches[0].pageY || 0;
                    if (lock[1]) {
                        df.slidemove(node[1], mov[2] + touch[0] - touch[1], 0);
                    } else {
                        if (Math.abs(touch[0] - touch[1]) > Math.abs(lock[2] - lock[3])) {
                            lock[1] = 1;
                            D.body.addEventListener('touchmove', df.prevent, false)
                        } else {
                            lock[0] = lock[1] = 0;
                            return
                        }
                    }
                }).on('touchend', function (e) {
                    if (lock[0] != 2) return;
                    lock[0] = 1;
                    touch[2] = e.originalEvent.changedTouches[0].pageX || 0;
                    if (Math.abs(touch[0] - touch[2]) > df.em << 2) {
                        if (touch[0] < touch[2] && idx > 0) idx--;
                        if (touch[0] > touch[2] && idx < node[0].length - 1) idx++;
                    }
                    node[0].removeClass('sel').eq(idx).addClass('sel');
                    mov[2] = idx * mov[1];
                    df.slidemove(node[1], mov[2], 300);
                    setTimeout(function () {
                        lock[0] = 0;
                        if (lock[1]) {
                            lock[1] = 0;
                            D.body.removeEventListener('touchmove', df.prevent, false)
                        }
                    }, 300);
                });
                return;
            } else {
                atag[0].width(atag[2]);
                atag[0].addClass('spe');
                node[2].on('touchstart', function (e) { //标题标签处理;
                    touch[3] = e.originalEvent.changedTouches[0].pageX || 0;
                }).on('touchmove', function (e) {
                    e.preventDefault();
                    touch[4] = e.originalEvent.changedTouches[0].pageX || 0;
                    df.slidemove(atag[0], atag[3] + touch[3] - touch[4], 0);
                }).on('touchend', function (e) {
                    touch[5] = e.originalEvent.changedTouches[0].pageX || 0;
                    atag[3] += (touch[3] - touch[4]);
                    atag[3] = (atag[3] <= 0) ? 0 : (atag[3] >= atag[2] - wid) ? atag[2] - wid : atag[3];
                    df.slidemove(atag[0], atag[3], 300);
                });
                node[0].on('click', function () { //标签点击处理;
                    if (node[0].html() == '') return;
                    var self = $(this);
                    self.addClass('sel').siblings().removeClass('sel');
                    idx = self.index();
                    mov[2] = idx * mov[1];
                    for (var d = idx - 1, tmp = 0; d >= 0; d--) tmp += atag[1].eq(d).width();
                    atag[3] = tmp;
                    atag[3] = (atag[3] <= 0) ? 0 : (atag[3] >= atag[2] - wid) ? atag[2] - wid : atag[3];
                    df.slidemove(node[1], mov[2], 300);
                    df.slidemove(atag[0], atag[3], 300);
                });
                node[1].on('touchstart', function (e) { //图片区域处理;
                    if (lock[0]) return;
                    touch[0] = e.originalEvent.changedTouches[0].pageX || 0;
                    lock[2] = e.originalEvent.changedTouches[0].pageY || 0;
                    lock[0] = 2;
                }).on('touchmove', function (e) {
                    if (lock[0] != 2) return;
                    touch[1] = e.originalEvent.changedTouches[0].pageX || 0;
                    lock[3] = e.originalEvent.changedTouches[0].pageY || 0;
                    if (lock[1]) {
                        df.slidemove(node[1], mov[2] + touch[0] - touch[1], 0);
                    } else {
                        if (Math.abs(touch[0] - touch[1]) > Math.abs(lock[2] - lock[3])) {
                            lock[1] = 1;
                            D.body.addEventListener('touchmove', df.prevent, false)
                        } else {
                            lock[0] = lock[1] = 0;
                            return
                        }
                    }
                }).on('touchend', function (e) {
                    if (lock[0] != 2) return;
                    lock[0] = 1;
                    touch[2] = e.originalEvent.changedTouches[0].pageX || 0;
                    if (Math.abs(touch[0] - touch[2]) > df.em << 2) {
                        if (touch[0] < touch[2] && idx > 0) idx--;
                        if (touch[0] > touch[2] && idx < node[0].length - 1) idx++;
                    }
                    node[0].removeClass('sel').eq(idx).addClass('sel');
                    for (var d = idx - 1, tmp = 0; d >= 0; d--) tmp += atag[1].eq(d).width() + (df.em << 1) + (df.em * 0.5);
                    atag[3] = tmp;
                    atag[3] = (atag[3] <= 0) ? 0 : (atag[3] >= atag[2] - wid) ? atag[2] - wid : atag[3];
                    mov[2] = idx * mov[1];
                    df.slidemove(node[1], mov[2], 300);
                    df.slidemove(atag[0], atag[3], 300);
                    setTimeout(function () {
                        lock[0] = 0;
                        if (lock[1]) {
                            lock[1] = 0;
                            D.body.removeEventListener('touchmove', df.prevent, false)
                        }
                    }, 300);
                });
                return;
            }
        },
        toggle: function (element) {
            var id = $(element);
            id.on("click", function () {
                var self = $(this), child = self.siblings("dd").find('a');
                if (self.find('b').is(".ico-downarrow")) {
                    self.siblings("dd").show();
                    self.find('b').attr("class", "ico-uparrow");
                    child.on("click", function () {
                        var self = $(this)
                    });
                } else {
                    self.siblings("dd").hide();
                    self.find('b').attr("class", "ico-downarrow");
                }
            })
        },
        hots: function (element) { //分类滑动;
            var $obj = $(element), node = [$obj.find('ul'), $obj.children('.show_cont'), $obj.find('li'), null],
                inlen = arguments.length, mov = [0, 0, 0], touch = [0, 0, 0], cls = null, fn = null;
            if (!$obj.length) return;
            for (var i = 0; i < inlen; i++) {
                if ($.type(arguments[i]) === "string" && cls == null) cls = arguments[i];
                if ($.type(arguments[i]) === "function" && fn == null) fn = arguments[i]
            }
            for (var i = node[2].length - 1; i >= 0; i--) node[3] += node[2].eq(i).width();
            mov[0] = node[3];
            mov[1] = node[1].width();
            node[0].width(node[3]);
            node[1].on('touchstart', function (e) {
                touch[0] = e.originalEvent.changedTouches[0].pageX || 0;
            }).on('touchmove', function (e) {
                e.preventDefault();
                touch[1] = e.originalEvent.changedTouches[0].pageX || 0;
                df.slidemove(node[0], mov[2] + touch[0] - touch[1], 0);
            }).on('touchend', function (e) {
                touch[2] = e.originalEvent.changedTouches[0].pageX || 0;
                mov[2] += touch[0] - touch[1];
                mov[2] = (mov[2] <= 0) ? 0 : (mov[2] >= mov[0] - mov[1]) ? mov[0] - mov[1] : mov[2];
                if (touch[0] == touch[2] || touch[0] - touch[1] == 0) return;
                df.slidemove(node[0], mov[2], 400);
            });
        },
        _click: function (element) {
            var id = $(element);
            $(".tab_cont>.box").hide().eq(0).show();
            id.on("click", function () {
                //location.replace(location.href);
                var self = $(this), i = self.index(), x = self.parent('ul').width() - W.innerWidth,
                    y = self.parent('ul').children().length;
                $('.tab_menu').find('a').removeClass('greenblue');
                self.children().addClass('greenblue');
                var m = x / (y - 1);
                self.parent('ul').css({
                    '-webkit-transform': 'translate3d(' + (-i * m) + 'px,0px,0px)',
                    'transform': 'translate3d(' + (-i * m) + 'px,0px,0px)',
                    '-webkit-transition-duration': '200ms',
                    'transition-duration': '200ms'
                });
                if (i == self.parent('ul').children().length - 1) self.parent('ul').css({
                    '-webkit-transform': 'translate3d(' + (-x) + 'px,0px,0px)',
                    'transform': 'translate3d(' + (-x) + ',0px,0px)',
                    '-webkit-transition-duration': '200ms',
                    'transition-duration': '200ms'
                });
                self.parent().parent().parent().next().children('.box').eq(i).show().siblings('.box').hide();
            })
        },
        tab: function (element) {
            df._click(element);
            var id = $(element), i = id.children('a.greenblue').parent().attr('data-num'),
                x = id.parent('ul').width() - W.innerWidth, y = id.parent('ul').children().length;
            var m = x / (y - 1);
            id.parent().css({
                '-webkit-transform': 'translate3d(' + (-i * m) + 'px,0px,0px)',
                'transform': 'translate3d(' + (-i * m) + 'px,0px,0px)',
                '-webkit-transition-duration': '200ms',
                'transition-duration': '200ms'
            });
            if (i == id.parent('ul').children().length - 1) id.parent('ul').css({
                '-webkit-transform': 'translate3d(' + (-x) + 'px,0px,0px)',
                'transform': 'translate3d(' + (-x) + ',0px,0px)',
                '-webkit-transition-duration': '200ms',
                'transition-duration': '200ms'
            });
        },
        Reading: function () { //阅读模式;
            var $obj = $('.cont_steps'),
                node = [$obj.siblings('.more_bar.bg_f5').find('b'), $obj.find('.inbox'), $obj.siblings('.more_bar.bg_f5'), $obj.find('.show_cont')],
                idx = 0, mov = [0, 0, 0], touch = [0, 0, 0, 0, 0, 0], atag = [0, 0, 0, 0], wid = $obj.width(),
                lock = [0, 0, 0, 0],
                h = W.innerHeight - $('header').height() - $('.more_bar.bg_f5').height();
            node[1].children('.u_scroll').width($obj.children().width());
            node[1].height(h);
            node[3].height(h);
            mov[1] = node[1].children('.u_scroll').width() + 10;
            mov[0] = mov[1] * node[1].children('.u_scroll').length;
            node[1].width(mov[0]);
            node[1].on('touchstart', function (e) {
                if (lock[0]) return;
                touch[0] = e.originalEvent.changedTouches[0].pageX || 0;
                lock[2] = e.originalEvent.changedTouches[0].pageY || 0;
                lock[0] = 2;
            }).on('touchmove', function (e) {
                if (lock[0] != 2) return;
                touch[1] = e.originalEvent.changedTouches[0].pageX || 0;
                lock[3] = e.originalEvent.changedTouches[0].pageY || 0;
                if (lock[1]) {
                    df.slidemove(node[1], mov[2] + touch[0] - touch[1], 0);
                } else {
                    if (Math.abs(touch[0] - touch[1]) > Math.abs(lock[2] - lock[3])) {
                        lock[1] = 1;
                        D.body.addEventListener('touchmove', df.prevent, false)
                    } else {
                        lock[0] = lock[1] = 0;
                        return
                    }
                }
            }).on('touchend', function (e) {
                if (lock[0] != 2) return;
                lock[0] = 1;
                touch[2] = e.originalEvent.changedTouches[0].pageX || 0;
                if (Math.abs(touch[0] - touch[2]) > df.em << 2) {
                    if (touch[0] < touch[2] && idx > 0) idx--;
                    if (touch[0] > touch[2] && idx < node[1].children('.u_scroll').length - 1) idx++;
                }
                node[0].text(idx + 1);
                mov[2] = idx * mov[1];
                df.slidemove(node[1], mov[2], 300);
                setTimeout(function () {
                    lock[0] = 0;
                    if (lock[1]) {
                        lock[1] = 0;
                        D.body.removeEventListener('touchmove', df.prevent, false)
                    }
                }, 300);
            });
            return;
        },
        rollbar: function () {
            var id = df.$fly_tag.parent(), sys = $(W), h = df.$fly_tag.height(), touch = [0, 0, 0];
            $('body').on('touchstart', function (e) {
                touch[0] = e.originalEvent.changedTouches[0].pageX || 0;
            }).on('touchmove', function (e) {
                touch[1] = e.originalEvent.changedTouches[0].pageX || 0;
                if (touch[1] - touch[0] > 0) {
                    df.$fly_tag.css({
                        '-webkit-transform': 'translate3d(0px,' + (h) + 'px,0px)',
                        'transform': 'translate3d(0px,' + (h) + 'px,0px)',
                        '-webkit-transition-duration': '200ms',
                        'transition-duration': '200ms'
                    });
                } else {
                    df.$fly_tag.css({
                        '-webkit-transform': 'translate3d(0px,0px,0px)',
                        'transform': 'translate3d(0px,0px,0px)',
                        '-webkit-transition-duration': '200ms',
                        'transition-duration': '200ms'
                    });
                }
            }).on('touchend', function (e) {
                touch[2] = e.originalEvent.changedTouches[0].pageX || 0;
                if (touch[2] - touch[0] > 0) {
                    df.$fly_tag.css({
                        '-webkit-transform': 'translate3d(0px,' + (h) + 'px,0px)',
                        'transform': 'translate3d(0px,' + (h) + 'px,0px)',
                        '-webkit-transition-duration': '200ms',
                        'transition-duration': '200ms'
                    });
                    setTimeout(function () {
                        id.hide();
                    }, 200);
                } else {
                    df.$fly_tag.css({
                        '-webkit-transform': 'translate3d(0px,0px,0px)',
                        'transform': 'translate3d(0px,0px,0px)',
                        '-webkit-transition-duration': '200ms',
                        'transition-duration': '200ms'
                    });
                    setTimeout(function () {
                        id.show();
                    }, 0);
                }
            });
        },
        isHeight: function (element) {
            var id = $(element), highly = [df.pg[1], $('header').height(), $('.more_bar.bg_f5').height()];
            id.height(highly[0] - highly[1] - highly[2]);
            //2.3.3内部滑动重置
            var u = W.navigator.userAgent;
            var old = u.match(/android\s?([0-9|\.]*)/i);
            if (old != null && old.length == 2 && /2\.3/.test(old[1])) { //2.3的操作系统
                $('.ul_scroll').css('overflow-y', 'hidden');
                var hei = id.height();
                df.isSroll('.ul_sroll > ul', hei);
                df.isSroll('.ul_sroll > .table_tags', hei);
            }
            id.find('li').on('click', function () {
                var self = $(this), ind = self.index();
                self.parent().children().removeClass('now');
                self.addClass('now');
                self.parent().parent().siblings().children().hide();
                self.parent().parent().siblings().children().eq(ind).show();
            })
        },
        isSroll: function (tag, hei) {
            var child = $(tag), mov = [0, 0, 0], touch = [0, 0, 0];
            if (child.height() <= hei) return;

            function move(value, timer) {
                child.css({
                    '-webkit-transform': 'translate3d(0px,' + (-1 * value) + 'px,0px)',
                    '-webkit-transition-duration': timer + 'ms',
                    'transform': 'translate3d(0px,' + (-1 * value) + 'px,0px)',
                    'transition-duration': timer + 'ms',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                });
                return
            }

            mov[0] = child.height();
            mov[1] = hei;
            child.parent().on('touchstart', function (e) {
                touch[0] = e.originalEvent.changedTouches[0].pageY || 0;
            }).on('touchmove', function (e) {
                e.preventDefault();
                touch[1] = e.originalEvent.changedTouches[0].pageY || 0;
                move(mov[2] + touch[0] - touch[1], 0);
            }).on('touchend', function (e) {
                touch[2] = e.originalEvent.changedTouches[0].pageY || 0;
                mov[2] += touch[0] - touch[1];
                mov[2] = (mov[2] <= 0) ? 0 : (mov[2] >= mov[0] - mov[1]) ? mov[0] - mov[1] : mov[2];
                if (touch[0] == touch[2] || touch[0] - touch[1] == 0) return;
                move(mov[2], 400);
            });
        },
        getbody: function (id) {
            $('html,body').css({'overflow': 'hidden'});
            setTimeout(function () {
                if ($('body').height() > window.innerHeight) {
                    $(id).css({'height': $('body').height()}).show();
                } else {
                    $(id).css({'height': window.innerHeight}).show();
                }
                $(id).find('.btnClose').on("click", function () {
                    $(id).hide();
                    $('html,body').css({'overflow': 'auto'});
                });
            }, 800);
            return;
        },
        share_tips: function (id) {
            df.getbody(id);
        },
        dialogGet: function (id) {
            df.getbody(id);
        }

    };
    // load more
    var loadMoreTriEl = $('.j-loadmore');
    var listContainerEl = $('.j-list-container');
    var gotop = null;
    if (loadMoreTriEl.length && listContainerEl.length) {
        loadMoreTriEl.on('click', function (ev) {
            ev.preventDefault();
            var thisEl = $(this);
            thisEl.find('span').text('加载中...');
            $.ajax({
                type: 'GET',
                url: thisEl.data('url'),
                data: {
                    page: thisEl.data('next')
                },
                dataType: "html",
                success: function (data) {
                    var targets = $(data).find(".j-list-container").html();
                    var next = thisEl.data('next') + 1;
                    var total = thisEl.data('total');
                    if (next <= total) {
                        thisEl.data('next', next);
                        thisEl.attr('href', thisEl.data('url') + '_' + next);
                        //console.log(next);
                    } else {
                        thisEl.hide();
                    }
                    if (targets) listContainerEl.append(targets);
                    else loadMoreTriEl.hide();
                    thisEl.find('span').text('点击加载更多');

                },
                error: function (xhr, type) {
                    loadMoreTriEl.hide();
                    console.log(xhr);
                }
            })
        });
    }

    $(function () {
        df.init();
        var s = document.referrer;
    });
}(jQuery, window, document);