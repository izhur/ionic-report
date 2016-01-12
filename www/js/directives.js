angular.module('starter.directives', [])


.filter('newlines',function(){
	return function(text) {
		if (typeof text=='string') {
			return text.replace(/\n/g,'<br/>');
		} else {
			return '';
		}
	};
})
.filter('nl2br', function($sce){
    return function(msg,is_xhtml) { 
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
})

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
.filter('rupiah', function(){
    return function(text,n, x, s, c, sym) { 
        if (typeof text=='number') {
        	n = n||2;
        	x = x||3;
        	s = s||'.';
        	c = c||',';
        	sym = sym||'Rp ';
        	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        	num = text.toFixed(Math.max(0, ~~n));
    		return sym+(c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
        } else {
        	return text;
        }
    }
})

.filter('spaceleft', function() {
	return function(input, n) {
		if(input === undefined)
			input = ""
		var zeros = "&nbsp;".repeat(n);
		console.log(zeros);
		return (zeros + input).slice(-1 * n)
	};
})
;

Number.prototype.formatMoney = function(n, x, s, c, sym) { 
    n = n||2;
    x = x||3;
    s = s||'.';
    c = c||',';
    sym = sym||'Rp ';

    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return sym+(c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};