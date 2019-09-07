/* 
	--- 移动端幻灯片/轮播切换 ---
	本脚本需要jquery的支持,建议使用版本1.6+;
	本公用弹层主要为移动端写的，PC端只支持html5+css3与IE9以外的现代浏览器,因使用属性transform:translate3d来控制移动,IE9对这个CSS3属性不支持;
	当页面有多个轮播根节点时(_slide.length > 1),自动轮播失去效果，主要是考虑多轮播节点都支持自动轮播对性能的影响;
	可以自定义轮播区域的高、宽值,省略高、宽值默认为屏宽的正方形，高、宽值可以大于屏宽将自动修正为屏宽，宽度值可以是0~1之间的小数，将转为屏宽的百分比取值，高度在0~1之间的小数则取宽度的百分比取值;
	图形数据方面没有做Ajax异步加载,不过有异步加载的次级替代方法(在IMG标签上调默认图片,把加载的图片地址写在data-src里面),客户端图片没有做高度尺寸控制,注意需要人为控制或后台脚本动态裁剪供客户端使用;
	考虑到网速与加载的原因,目前只针对延时加载的图片有图片水平与垂直居中功能(图片UEL写在data-src中的图片的延时加载);
	（注：在使用上面，幻灯片默认是放在页面顶部，由于结构原因，若是幻灯片_slide上部有内容比较多的话，请写一个有样式标签包含或写个空的div包含，否侧会引起touch功能失效）
*/
!function ($, wd, dm, undefined) {
    "use strict";
    wd.slide = {
        id: $('._slide'),
        dom: [],
        wdh: wd.innerWidth,
        pgh: wd.innerHeight,
        size: {w: 0, h: 0},
        mov: [],
        len: [],
        auto: 0,
        touch: [0, 0, 0, 0, 0],
        lock: 0,
        scrlock: 0,
        timer: null,
        mobile: /Mobile|Browser/i.test(navigator.userAgent),
        webkit: /Webkit/i.test(navigator.userAgent),
        moz: /Firefox/i.test(navigator.userAgent),
        controlbotton: "<div class='btnleft' title='向左滚动'> </div><div class='btnright' title='向右滚动'> </div>",
        is: function (obj, type) {
            var tp = !!obj ? {}.toString.call(obj).slice(8, -1) : !1;
            return !!type ? tp.toString().toUpperCase() == type.toString().toUpperCase() : tp
        },
        resize: function (obj) {
            var myhgt = obj.height();
            if (myhgt >= slide.size.h) {
                obj.css({'margin-top': (slide.size.h - myhgt) / 2 + "px"})
            } else {
                var newwid = Math.pow(slide.size.w, 2) / myhgt;
                obj.css({
                    width: newwid + "px",
                    height: slide.size.h + "px",
                    'margin-left': (slide.size.w - newwid) / 2 + "px"
                })
            }
            return
        },
        afterload: function (dom) {
            if (dom && dom.data('src')) {
                dom.attr('src', dom.data('src'));
                dom.get(0).onload = function () {
                    var self = $(this), parentobj = self.parents('ul').children('li'),
                        indexval = self.parents('li').index(), len = parentobj.length - 1;
                    slide.resize(self);
                    if ((indexval != 1) && (indexval != (len - 1))) return;
                    var deny = (indexval == 1) ? len : (indexval == len - 1) ? 0 : -1,
                        mem = parentobj.eq(deny).find("img");
                    mem.attr('src', mem.data('src'));
                    slide.resize(mem)
                }
            }
            return
        },
        preventDefault: function (e) {
            e.preventDefault();
            return
        },
        start: function (e) {
            if (slide.lock) return;
            clearTimeout(slide.timer);
            slide.touch[0] = e.changedTouches[0].pageX || 0;
            slide.touch[3] = e.changedTouches[0].pageY || 0;
            slide.lock = 2
        },
        move: function (e) {
            if (slide.lock != 2) return;
            slide.touch[1] = e.changedTouches[0].pageX || 0;
            slide.touch[4] = e.changedTouches[0].pageY || 0;
            if (slide.scrlock) {
                var self = $(this), eq = self.index(),
                    val = slide.mov[eq] * slide.size.w + (slide.touch[0] - slide.touch[1]);
                self.find('ul').css({
                    '-webkit-transform': 'translate3d(' + (-1 * val) + 'px,0px,0px)',
                    '-webkit-transition-duration': '0ms',
                    'transform': 'translate3d(' + (-1 * val) + 'px,0px,0px)',
                    'transition-duration': '0ms'
                })
            } else {
                if (Math.abs(slide.touch[0] - slide.touch[1]) > Math.abs(slide.touch[3] - slide.touch[4])) {
                    slide.scrlock = 1;
                    dm.body.addEventListener('touchmove', slide.preventDefault, false)
                } else {
                    slide.lock = slide.scrlock = 0;
                    return
                }
            }
        },
        end: function (e) {
            if (!slide.lock && !slide.scrlock) (slide.auto && slide.autoplay());
            if (slide.lock != 2) return;
            slide.lock = 1;
            if (slide.auto && !e) {
                var $this = slide.id, eq = 0;
                slide.touch[2] = 0
            } else if (slide.is(e, 'Object')) {
                var $this = $(e);
                eq = $this.index();
                slide.touch[2] = 0
            } else {
                var $this = $(this), eq = $this.index();
                slide.touch[2] = (slide.mobile) ? e.changedTouches[0].pageX || 0 : 0
            }
            (slide.touch[0] - slide.touch[2] > slide.wdh * 0.2) ? slide.mov[eq]++ : (slide.touch[2] - slide.touch[0] > slide.wdh * 0.2) ? slide.mov[eq]-- : slide.mov[eq] += 0;
            slide.afterload($this.find('li').eq(slide.mov[eq]).children('img'));
            $this.find('ul').css({
                '-webkit-transform': 'translate3d(' + (-1 * slide.mov[eq] * slide.size.w) + 'px,0px,0px)',
                '-webkit-transition-duration': '300ms',
                'transform': 'translate3d(' + (-1 * slide.mov[eq] * slide.size.w) + 'px,0px,0px)',
                'transition-duration': '300ms'
            });
            setTimeout(function () {
                slide.mov[eq] = (slide.mov[eq] <= 0) ? slide.len[eq] : (slide.mov[eq] >= slide.len[eq] + 1) ? 1 : slide.mov[eq];
                $this.find('ul').css({
                    '-webkit-transform': 'translate3d(' + (-1 * slide.mov[eq] * slide.size.w) + 'px,0px,0px)',
                    '-webkit-transition-duration': '0ms',
                    'transform': 'translate3d(' + (-1 * slide.mov[eq] * slide.size.w) + 'px,0px,0px)',
                    'transition-duration': '0ms'
                });
                slide.afterload($this.find('li').eq(slide.mov[eq]).children('img'));
                var point = $this.find('i');
                point.removeClass('sel').eq(slide.mov[eq] - 1).addClass('sel');
                slide.lock = 0;
                if (slide.scrlock) {
                    slide.scrlock = 0;
                    dm.body.removeEventListener('touchmove', slide.preventDefault, false)
                }
                slide.auto && slide.autoplay()
            }, 300)
        },
        autoplay: function () {
            slide.timer = setTimeout(function () {
                if (slide.lock) return;
                slide.lock = 2;
                slide.touch[0] = slide.wdh * 0.3;
                slide.end()
            }, 4000)
        },
        btncontrol: function (e) {
            if (slide.lock) return;
            slide.lock = 2;
            clearTimeout(slide.timer);
            if (e.target.className == "btnleft") slide.touch[0] = ~(slide.wdh * 0.3);
            if (e.target.className == "btnright") slide.touch[0] = slide.wdh * 0.3;
            slide.end($(this).parent().parent())
        },
        init: function (hgt, wdh, auto, fn) {
            if (!this.mobile) this.wdh = this.id.parent().width();
            if (this.moz) this.wdh = (this.wdh <= screen.width) ? this.wdh : screen.width;
            if (this.wdh > this.pgh) {
                var tmp = this.wdh;
                this.wdh = this.pgh;
                this.pgh = tmp
            }
            this.size.w = (!this.is(wdh, 'Number') || !wdh || Math.abs(wdh) > this.wdh) ? this.wdh : (Math.abs(wdh) < 1) ? ~~(this.wdh * Math.abs(wdh)) : ~~Math.abs(wdh);
            this.size.h = (!this.is(hgt, 'Number') || !hgt || Math.abs(hgt) > this.wdh) ? this.size.w : (Math.abs(hgt) < 1) ? ~~(this.size.w * Math.abs(hgt)) : ~~Math.abs(hgt);
            if (this.id.length > 0) {
                for (var i = this.id.length - 1; i >= 0; i--) {
                    var tmp = $(this.id[i]);
                    this.dom[i] = [tmp, tmp.find('.slider'), tmp.find('ul'), tmp.find('li'), tmp.find('.slider_status')];
                    this.dom[i][0].height(this.size.h);
                    this.dom[i][1].height(this.size.h), this.dom[i][2].height(this.size.h);
                    this.dom[i][3].height(this.size.h);
                    this.dom[i][1].width(this.size.w);
                    this.dom[i][3].width(this.size.w);
                    this.len[i] = this.dom[i][3].length || 0;
                    tmp.find('img').width(this.size.w);
                    this.afterload(this.dom[i][3].first().children('img'));
                    if (this.dom[i][3].length <= 1) {
                        this.dom[i][2].width(this.size.w);
                        continue
                    } else {
                        slide.mov[i] = 1;
                        for (var n = 1, point = '<i class="sel"></i>'; n < this.len[i]; n++) point += '<i></i>';
                        this.dom[i][4].append(point);
                        var tmpfirst = this.dom[i][3].first().clone(), tmplast = this.dom[i][3].last().clone();
                        this.dom[i][2].width(this.size.w * (this.dom[i][3].length + 2)).prepend(tmplast).append(tmpfirst).css({
                            '-webkit-transform': 'translate3d(' + (-1 * this.size.w) + 'px,0px,0px)',
                            'transform': 'translate3d(' + (-1 * this.size.w) + 'px,0px,0px)'
                        });
                        if (this.mobile) {
                            this.id[i].addEventListener('touchstart', this.start, !1);
                            this.id[i].addEventListener('touchmove', this.move, !1);
                            this.id[i].addEventListener('touchend', this.end, !1)
                        } else {
                            this.dom[i][1].append(this.controlbotton);
                            $(this.id[i]).find('.btnleft').on('click', this.btncontrol);
                            $(this.id[i]).find('.btnright').on('click', this.btncontrol)
                        }
                        if (this.id.length < 2 && auto) {
                            this.auto = 1;
                            this.autoplay()
                        }
                    }
                }
                if ((!this.mobile && !this.webkit) || this.moz) {
                    slide.id.find('li').css({'float': 'left', 'width': slide.size.w + 'px'});
                    slide.id.find('img').css({'width': slide.size.w + 'px'})
                }
                $.type(fn) == 'function' && fn()
            }
        }
    }
}(jQuery, window, document);