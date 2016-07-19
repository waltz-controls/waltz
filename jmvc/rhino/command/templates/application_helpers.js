MVC.Object.extend(MVC.View.Helpers.prototype, {
    print_resources:function(a){
        var result = [];
        if(a.length > 0) {
            result.push('"');
            result.push(a[0]);
            result.push('"');
            for(var i = 1, size = a.length; i < size; ++i){
                result.push(',');
                result.push('"');
                result.push(a[i]);
                result.push('"');
            }
        }
        return result.join('');
    }
});