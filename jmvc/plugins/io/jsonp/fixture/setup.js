/**
 *
 * @author Ingvord
 * @since 31.03.12
 */
include.plugins('io/ajax/fixtures', 'io/jsonp');
/**
 * Changes url for MVC.JsonP.
 * <p/>
 * Replaces <code>'http://<server>:<port>'</code> with <code>'../../test/fixtures'</code>, i.e.
 * <p/>
 * <code>http://localhost:8080/MyApp/backend/Some.json</code> -> <code>../../test/fixtures/MyApp/backend/Some.json.get</code>
 * <p/>
 * Fixture should contain a valid JavaScript code, where test data passed to MVC.JsonP._cbs.fixture function. Example:
 * <p/><code>
 *     MVC.JsonP._cbs.fixture({"text":"Hello World!!!"});
 * </code>
 *
 */
MVC.JsonP.prototype.send = (function (oldSend) {
    MVC.JsonP.prototype.send0 = oldSend;
    return function () {
        var method = this.options.method || this.options.parameters.action;
        var options = MVC.Ajax.setup_request(this.url, {method:method,repeat_fixture:true});
        this.url = options.url;
        this.send0();
    }
})(MVC.JsonP.prototype.send);

/**
 * Changes callback function name from random to fixed.
 * In fixtures use 'MVC.JsonP._cbs.fixture' to wrap test data.
 *
 */
MVC.JsonP.prototype.callback_and_random = (function (oldCallback_and_random) {
    MVC.JsonP.prototype.callback_and_random0 = oldCallback_and_random;
    return function (n) {
        return this.callback_and_random0("fixture");
    }
})(MVC.JsonP.prototype.callback_and_random);