/**
 * Created by laoya on 16/5/20.
 * 复制添加版权模块
 */

$(function(){
  // 初始化版权内容

  var copyRightStr = '<br><br>';
  copyRightStr += '作者:'+$sc['author'];
  copyRightStr += ('<br>来源链接:' + window.location.href + '<br>');
  copyRightStr += '来源:润疗养生网<br>';
  copyRightStr += '著作权归作者所有。';

  $('body').on('copy', function(ev){
    if (ev.clipboardData) {
      // IE9+ chrome26+ firefox
      ev.preventDefault();
      ev.clipboardData.setData('text/plain', window.getSelection() + copyRightStr);
    } else if (window.clipboardData) {
      // IE6 7 8
      window.setTimeout(function(){
        clipboardData.setData('Text', clipboardData.getData("Text") + copyRightStr);
      }, 100);
    } else {
      // chrome26-
      var dom = $('<div></div>');
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      dom.css({
        position: 'absolute',
        left: '-9999999px'
      });
      dom.html(selection + copyRightStr);
      dom.appendTo('body');
      selection.selectAllChildren(dom[0]);

      window.setTimeout(function () {
        dom.remove();
        selection.removeAllRanges();
        selection.addRange(range);
        selection = null;
      }, 0);

    }
  });
});

