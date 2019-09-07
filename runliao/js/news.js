$(function(){
	var hrefs=window.location.pathname.split('_');
	//console.log(hrefs);
	var html='';
	var page=hrefs[1]?parseInt(hrefs[1]):1;
	if(page>1){
		var _=page==2?'':'_'+(page-1);
		html+='<a href="'+hrefs[0]+_+'" class="prev">&lt;&lt;上一页</a>';
	}
	
	if('undefined'==typeof(next)) next=0;

	if(next>0){
		page++;
		html+='<a href="'+hrefs[0]+'_'+page+'" class="next j-pageover-next">下一页&gt;&gt;<span>还剩<b>'+next+'</b>段未读</span></a>';
	}
	if(html) document.getElementById('pageover').innerHTML+=html;
	
	// 对内容部分重新排版
	var contentEl = $('.j-content');
	/*
	var contentPartEls = contentEl.children();
	var guideContentEl = $('.j-guide');
	var isGuideOver = false;
	var tempItemEl;
	var tempPicPEl;
	var itemIndex = 1;
	var articleCreateTime = $('h1 span').first().text().split('-');
	// 找出导语部分
	var i=location.href.split('_');
	if(!parseInt(i[1])) i[1]=1;
	itemIndex=itemIndex+(parseInt(i[1])-1)*4;
	contentPartEls.each(function(){
        if(this.nodeName != 'BR') {
            if(this.nodeName == 'P' && !isGuideOver) {
                guideContentEl.append(this);
            }else if(this.nodeName == 'H2'){
                isGuideOver = true;
                tempItemEl = $('<div>').addClass('item');
                tempItemEl.append(this);


                tempItemEl.append('<div class="index-icon">' + itemIndex + '</div>');
                //tempItemEl.append('<div class="opacity-mask"></div>');
                itemIndex++;
                tempItemEl.appendTo(contentEl);
                tempPicPEl = null;
            }else{
                tempItemEl.append(this);
                // if(parseInt(articleCreateTime[0]) >= 2014 && parseInt(articleCreateTime[1]) >= 10){
                // 	tempItemEl.append(this);
                // }else{
                // 	if($(this).find('img').length){
                // 		tempItemEl.append(this);
                // 		tempPicPEl = this;
                // 	}else{
                // 		if(tempPicPEl){
                // 			$(this).insertBefore(tempPicPEl);
                // 		}else{
                // 			tempItemEl.append(this);
                // 		}
                // 	}
                // }
            }
        }
	});*/
	// 兼容之前非标准文档格式
	if(!contentEl.find('h2').length){
		//guideContentEl.parent().children('span').hide();
		$('.j-steps-reader-link').hide();
	}

  // 将百度本地广告插入到每段尾
  var bdAdEls = $('.j-bd-section-ad>div');
  var contentItems = contentEl.children('div.item');
  contentItems.each(function(index){
    if(index < contentItems.length - 1)$(this).append(bdAdEls.eq(index));
  });

  // 禁用选择 复制 粘贴
  /*contentEl
    .on('selectstart contextmenu paste copy cut', function(){
      return false;
    });*/

	// JS 分页 4步一页
    // TODO： querystring 只解析了 page 参数
    //var totalPage = Math.floor((contentEl.children().length - 1)/4) + 1;
    var curPageIndex = parseInt(location.href.substring(location.href.indexOf('_')+1)) || 1;
    //var pagerEl;
    //if(totalPage > 1){
    //    pagerEl = $('<div>').addClass('pager2');
    //    if(~location.href.indexOf('_')){
    //        curPageIndex = parseInt(location.href.substring(location.href.indexOf('_')+5)) || 1;
    //    }else{
    //        curPageIndex = 1;
    //    }
    //    for (var i = 1; i <= totalPage; i++) {
    //        if (i == curPageIndex) {
    //            pagerEl.append('<span class="current">' + i + '</span>');
    //        }else{
    //            pagerEl.append('<a href="' + location.pathname + '?page=' + i + '">' + i + '</a>');
    //        }
    //    }
    //    if(curPageIndex != -1){
    //        contentEl.children().each(function(index){
    //            if(parseInt(index/4) + 1 != curPageIndex){
    //                $(this).hide();
    //            }
    //        });
    //        pagerEl.append('<a href="' + location.pathname + '?page=' + (curPageIndex>=totalPage?totalPage:curPageIndex+1) + '">下一页</a>');
    //    }
    //    pagerEl.append('<a href="' + location.pathname + '?page=-1">查看全文&gt;&gt;</a>');
    //    pagerEl.insertAfter(contentEl);
    //}
	
	contentEl.css('visibility', 'visible');

	// 生成分步阅读入口
	var stepsLinkEl = $('.j-steps-reader-link');
	var stepsLinkElTri = stepsLinkEl.find('.text-link');
	var iframeEl;
	contentEl.children().each(function(index){
		if(index > 5) return false;
        if(this.nodeName != 'BR') {
        	var imgSrc=$(this).find('img').attr('src')||'/20.jpg';
            var linkUrl = '/reader/' + stepsLinkEl.data('id') + '?step=' + (index + 1);
            // stepsLinkElTri.before('<li><a href="javascript:;"><img src="' +
            // 					$(this).find('img').attr('src') +
            // 					'"/></a><span class="b-mask"></span><a class="b-link" href="javascript:;">' +
            // 					$(this).find('h2').text() +
            // 					'</a></li>');
            stepsLinkElTri.before('<li><a href="' + linkUrl + '"><img src="' +
            imgSrc+
            '"/></a><span class="b-mask"></span><a class="b-link" href="' + linkUrl + '">' +
            $(this).find('h2').text() +
            '</a><a class="b-index" href="' + linkUrl + '">' + (index + 1) + '</a></li>');
        }
	});
	stepsLinkElTri.find('a').attr('href', '/reader/' + stepsLinkEl.data('id') + '?step=1');
	stepsLinkEl.css('opacity', 1);
	stepsLinkEl.on('mouseenter', 'li', function(){
		$(this).addClass('on');
	});
	stepsLinkEl.on('mouseleave', 'li', function(){
		$(this).removeClass('on');
	});
	// stepsLinkEl.on('click', 'a', function(){
	// 	if(iframeEl){
	// 		return iframeEl.show();
	// 	}
	// 	iframeEl = $('<iframe>');
	// 	iframeEl.css({
	// 		position: 'fixed',
	// 		top: 0,
	// 		left: 0,
	// 		border: 'none',
	// 		height: window.innerHeight,
	// 		width: window.innerWidth
	// 	});
	// 	iframeEl.attr('src', '/album/' + stepsLinkEl.data('id'));
	// 	iframeEl.appendTo('body');
	// 	iframeEl.show();
	// });


	var levelEl = $('.j-level');
	if(levelEl.length){
		var levelArr = levelEl.data('level').toString().split('');
		var posArr = [0, -10, -20, -32, -45, -57, -69, -81, -93, -105]
		for(var i = 0; i < levelArr.length; i++){
			var iEl = $('<i>');
			iEl.css('background-position', posArr[parseInt(levelArr[i])] + 'px ' + '0px');
			levelEl.append(iEl);
		}
	}

    window.setTimeout(function(){
        var wigetWrapEl = $('<div class="side-nav-wrap">').appendTo('body');
        var lebalRelEl = $('.col-right .j-lebal-relate');
        var qaEl = $('.col-right .j-qa');
        var titleEls = contentEl.find('h2,h3,h4');
        var navTree = $('<ol class="side-nav">');
        var navTreeTriggerEl = $('<div class="side-nav-trigger on"></div>');
        var toTopEl = $('<div class="to-top"></div>').appendTo(wigetWrapEl);
        //var pageoverNext = $('.j-pageover-next');
        var pageoverNext = $('#pageover');
        var pageoverPrev = $('.j-pageover-prev');
        var rightColHeight = $('.col-right').outerHeight() + $('.col-right').offset().top - lebalRelEl.outerHeight();
        var leftColHeight = $('.col-left').outerHeight() + $('.col-left').offset().top;
        var windowHeight = $(window).height();
        var bodyHeight = $('body').height();
        var lebalRelHeight = lebalRelEl.outerHeight();
        var qaHeight = qaEl.outerHeight();
        var pageoverNextHeight = pageoverNext.outerHeight();
        var ie6=!-[1,]&&!window.XMLHttpRequest;
        var wigetHeight;
        var navTreeLis;
        var clickFlag;
        // 生成目录树
        if(titleEls.length > 1 && bodyHeight/windowHeight > 2.5){
            var i = 0;
            var curTargetIndex;
            var curTargetTop;
            titleEls.each(function(index){
                if(this.nodeName == 'H2') i++;
                //curTargetIndex = Math.floor((i-1)/4)+1;
                //curTargetTop = curTargetIndex != curPageIndex?0:parseInt($(this).offset().top);
                curTargetTop = parseInt($(this).offset().top);
                navTree.append('<li data-index="' + i + '" class="' + this.nodeName.toLowerCase() + '"><a href="#' + i + '" data-top="' + curTargetTop + '">' + $(this).text() + '</a><i></i></li>');
            });
            navTree.appendTo(wigetWrapEl);
            navTreeTriggerEl.appendTo(wigetWrapEl);

            navTree.on('click', 'a', function(ev){
                ev.preventDefault();
                if ($(this).data('top')) {
                    clickFlag = true;
                    $('body').animate({
                        'scrollTop': $(this).data('top') - 20
                    }, 200);
                    navTree.children().removeClass('on');
                    $(this).parent().addClass('on');
                    window.setTimeout(function(){
                        clickFlag = false;
                    }, 1000);
                }
            });

            navTreeTriggerEl.on('click', function(){
                navTree.toggle();
                navTreeTriggerEl.toggleClass('on');
            });

            navTreeLis = navTree.find('a');

            function windowScrollHandler(ev){
                // if(clickFlag) return;
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                for(var i = navTreeLis.length - 1; i >= 0; i--){
                    if(scrollTop >= $(navTreeLis[i]).data('top') || i == 0){
                        navTree.find('.h3,.h4').hide();
                        navTree.find('[data-index=' + $(navTreeLis[i]).parent().data('index') + ']').show();
                        break;
                    }
                }
                wigetHeight = navTree.outerHeight() + lebalRelHeight + qaHeight + pageoverNextHeight + 120;
                if(scrollTop + windowHeight > rightColHeight + wigetHeight){
                    if(scrollTop + windowHeight > leftColHeight){
                        wigetWrapEl.css({
                            'position': 'absolute',
                            'top': leftColHeight
                        });
                        lebalRelEl.css({
                            'position': 'absolute',
                            'top': leftColHeight - wigetHeight - 30 + qaHeight
                        });
                        pageoverNext.css({
                            'position': 'absolute',
                            'top': leftColHeight - wigetHeight - 10
                        });
                        if(windowHeight - 20 - wigetHeight - 30 - 20 > 0){
                            qaEl.css({
                                'position': 'absolute',
                                'top': leftColHeight - wigetHeight - 30 - 20
                            });
                        }
                    }else{
                        if(ie6){
                            wigetWrapEl.css({
                                'position': 'absolute',
                                'top': scrollTop + windowHeight - 20
                            });
                            lebalRelEl.css({
                                'position': 'absolute',
                                'top': scrollTop + windowHeight - 20 - wigetHeight - 30 + qaHeight
                            });
                            pageoverNext.css({
                                'position': 'absolute',
                                'top': scrollTop + windowHeight - 20 - wigetHeight - 10
                            });
                            if(leftColHeight - wigetHeight - 30 - 20 > 0){
                                qaEl.css({
                                    'position': 'absolute',
                                    'top': leftColHeight - wigetHeight - 30 - 20
                                });
                            }
                        }else{
                            wigetWrapEl.css({
                                'position': 'fixed',
                                'top': windowHeight - 20
                            });
                            lebalRelEl.css({
                                'position': 'fixed',
                                'top': windowHeight - 20 - wigetHeight - 30 + qaHeight
                            });
                            pageoverNext.css({
                                'position': 'fixed',
                                'top': windowHeight - 20 - wigetHeight - 10
                            });
                            if(windowHeight - 20 - wigetHeight - 30 - 20 > 0){
                                qaEl.css({
                                    'position': 'fixed',
                                    'top': windowHeight - 20 - wigetHeight - 30 - 20
                                });
                            }
                        }

                    }
                    navTree.css('visibility', 'visible');
                    navTreeTriggerEl.css('visibility', 'visible');
                    toTopEl.css('visibility', 'visible');
                    pageoverNext.css('visibility', 'visible');
                }else{
                    navTree.css('visibility', 'hidden');
                    navTreeTriggerEl.css('visibility', 'hidden');
                    toTopEl.css('visibility', 'hidden');
                    pageoverNext.css('visibility', 'hidden');
                    lebalRelEl.css('position', 'static');
                    qaEl.css('position', 'static');
                }
                if(clickFlag) return;
                for(var i = navTreeLis.length - 1; i >= 0; i--){
                    if($(navTreeLis[i]).data('top') && (scrollTop >= $(navTreeLis[i]).data('top') || i == 0)){
                        navTree.children().removeClass('on');
                        $(navTreeLis[i]).parent().addClass('on');
                        break;
                    }
                }
            }
            $(window).on('scroll', windowScrollHandler).trigger('scroll');

            // hash跳转
            window.setTimeout(function(){
                if(location.hash){
                    var hash = decodeURIComponent(location.hash);
                    var href;
                    navTreeLis.each(function(){
                        href = $(this).attr('href');
                        if(href.substring(href.indexOf('#')) == hash){
                            $(this).trigger('click');
                            return false;
                        }
                    })
                }
            }, 200);
        }
        toTopEl.on('click', function(){
            $(window).scrollTop(0);
        })
    }, 1000);

    //copyAddRight('转载请注明：[<a href="http://www.leha.com">来源于乐哈健康网</a>]');
}); 

