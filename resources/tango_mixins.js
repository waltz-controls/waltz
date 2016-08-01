MVC.Object.extend(TangoWebapp, {
    mixin: {
        TabActivator: {
            _isActive: false,
            activate: function () {
                this.show(true);
                this._isActive = true;
            }
        },

        DeviceSetter: {
            device_setter: function (device) {
                webix.assert(device, "device can not be undefined");
                this._device = device;
                return device;
            }
        },

        /**
         * Performs action defined in run function only if this component is visible
         */
        Runnable: {
            _delay: 1000,
            _intervalId: 0,
            start: function(){
                this._intervalId = setInterval(function(){
                    if(this.isVisible())
                        this.run()
                }.bind(this), this._delay);
            },
            changeDelay: function(delay){
                this._delay = delay;
                this.stop();
                this.start();
            },
            stop:function(){
                clearInterval(this._intervalId);
            }
        }
    }
});