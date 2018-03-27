/**
 * Created by
 * User: khokhria
 * Date: 10.01.12
 */
(function($) {
    $.ajaxSetup({
        converters : {
            'iframe jsonp' : function(iframe) {
                return $.globalEval($(iframe[0].body).text());
            }
        }
    });
})(jQuery);
