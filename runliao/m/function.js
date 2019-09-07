(function () {
    //合并JSON
    function mergeJSON(minor, main) {
        for (var key in minor) {
            if (main[key] === undefined) { // 不冲突的，直接赋值
                main[key] = minor[key];
                continue;
            }
            if (isJSON(minor[key])) {
                // arguments.callee 递归调用，并且与函数名解耦
                arguments.callee(minor[key], main[key]);
            }
        }
    }

    function isJSON(target) {
        return typeof target == "object" && target.constructor == Object;
    }

    var mescroll_custom = function () {};
    // config={
    //     mescrollId:"mescrollId",
    //     option:{},
    //     setDataCB:function(data){},
    //     ajaxOpt:{}
    // }
    mescroll_custom.prototype.init=function(config){
        var that=this
        var option={
            down: {
                use: false,
            },
            up: {
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 7 //每页数据条数,默认10
                },
                clearEmptyId: "list",
                isBoth: true,
                isBounce: true,
                callback: getListData,
                htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
                htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',

                lazyLoad: {
                    use: true
                }
            }
        }
        mergeJSON(option,config.option)
        window.mescroll = initMeScroll(config.mescrollId||"mescroll", config.option);

        function getListData(page) {
            //联网加载数据
            getListDataFromNet( page.num, page.size,  function (curPageData) {
                config.setDataCB && config.setDataCB(curPageData)

            }, function () {
                mescroll.endErr();
            });
        }


        // 请求数据
        function getListDataFromNet( pageNum, pageSize, successCallback, errorCallback) {

            config.ajaxOpt=that.ajaxOpt;
            config.ajaxOpt.req_data.page=pageNum;
            $.ajax({
                type: 'GET',
                url: config.ajaxOpt.url||"",
                cache:false,
                data: config.ajaxOpt.req_data||{},
                dataType: 'json',
                success: function (data) {
                    successCallback(data);
                },
                error: errorCallback
            });
        }
    }
    mescroll_custom.prototype.ajaxOpt={

    }
    window.Drop=new mescroll_custom()
})()