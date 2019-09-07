function initMeScroll(mescrollId, options) {
	//下拉刷新的布局内容

	//上拉加载中的布局
	var htmlLoading = '<img class="upwarp-progress mescroll-rotate" src="option/mescroll-progress.png"/><img class="upwarp-slogan" src="option/mescroll-slogan.png"/>';
	//无数据的布局
	var htmlNodata = '<img class="upwarp-nodata" src="option/mescroll-nodata.png"/>';

	//自定义的配置 (以下注释部分等同于mescroll本身的默认配置,这里贴出来是为了便于理解,实际项目可直接删除)
	var myOption={
	}

	//加入自定义的默认配置
	options=MeScroll.extend(options,myOption);

	//创建MeScroll对象
	return new MeScroll(mescrollId,options);
}