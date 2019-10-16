function ajax_post(formEl,processer) // 表单对象，用 jQuery 获取，回调函数名
{
    if(typeof(processer) != 'function'){
        processer = _ajax_post_processer;
    }

    var custom_data = {
        post_type: 'ajax'
    };

    formEl.ajaxSubmit({
        dataType: 'json',
        data: custom_data,
        success: processer,
        error: function (error)
        {
            if ($.trim(error.responseText) != '')
            {
                alert('发生错误, 返回的信息:'+' '+error.responseText);
            }
        }
    });
}

function _ajax_post_processer(result)
{
    if (typeof(result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        if(result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }else if(result.err){
        	alert(result.err);
        	window.location.reload();
        }else{
            window.location.reload();
        }
    }
}