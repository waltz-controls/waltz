;
/**
 * This plugin wraps File API
 *
 * User: ingvord
 * Date: 3/8/14
 */

/**
 *
 * @type {*}
 */
MVC.FileSystem = MVC.Class.extend(
    /*@Static*/
    {
        _error: function (errCbk) {
            return function (err) {
                var msg = '';

                switch (err.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'QUOTA_EXCEEDED_ERR';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'NOT_FOUND_ERR';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'SECURITY_ERR';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'INVALID_MODIFICATION_ERR';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'INVALID_STATE_ERR';
                        break;
                    case FileError.PATH_EXISTS_ERR:
                        msg = 'PATH_EXISTS_ERR';
                        break;
                    default:
                        msg = 'Unknown Error code = ' + err.code;
                        break;
                }

                console.error('Error: ' + msg);
                if (errCbk) errCbk(msg)
            }
        },

        requestFileSystem: function (cbk) {
            if (!window.requestFileSystem) throw 'Unsupported operation: requestFileSystem';
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, cbk, this._error());
        }
    },
    /*@Prototype*/
    {
        getFile: function (path, cbk, errCbk) {
            this.Class.requestFileSystem(
                function (fs) {
                    fs.root.getFile(path, {create: true, exclusive: false}, cbk, MVC.FileSystem._error(errCbk));
                }
            );
        },
        getDirectory: function (path, cbk, errCbk) {
            //TODO create directories tree
            this.Class.requestFileSystem(
                function (fs) {
                    fs.root.getDirectory(path, {create: true, exclusive: false}, cbk, MVC.FileSystem._error(errCbk));
                }
            );
        }
    });

MVC.IO.FileSystem = MVC.FileSystem;

