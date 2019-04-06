/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/2/19
 */
TangoPollable = MVC.Model.extend("pollable",
    {
        attributes:{
            name: 'string',
            device_id: 'string',
            polled: 'boolean',
            poll_rate: 'int',
            polling_type: 'string'
        },
        default_attributes:{
            polled: false,
            poll_rate: undefined
        }
    },
    {
        /**
         *
         * @return {Promise<TangoPollable>}
         */
        fetchPollingStatus() {
            const device = PlatformContext.devices.getItem(this.device_id);
            return device.fetchAdmin().then(admin => {
                return admin.devPollStatus(device.name);
            }).then((resp) => {
                const polled = resp.output.find(el => el.includes(`name = ${this.name}`));
                if(polled === undefined)
                    this.update_attributes({
                        polled: false,
                        poll_rate : undefined
                    });
                else {
                    const splitElement = polled.split('\n')[1];
                    this.update_attributes({
                        polled: true,
                        poll_rate: splitElement.includes("external") ? "0 i.e. external" : splitElement.split(" = ")[1]
                    });
                }

                return this;
            });
        },
        /**
         * @event tango_command.update
         * @type {OpenAjax}
         * @property {TangoCommand} data
         * @memberof TangoWebappPlatform
         */
        /**
         * @event tango_attribute.update
         * @type {OpenAjax}
         * @property {TangoAttribute} data
         * @memberof TangoWebappPlatform
         */
        /**
         *
         * @param {boolean} polled
         * @param {int} poll_rate
         * @return {PromiseLike<TangoPollable>}
         *
         * @fires event:update
         */
        updatePolling(polled, poll_rate){
            const device = PlatformContext.devices.getItem(this.device_id);
            return device.fetchAdmin().then(admin => {
                return admin.updatePolling(device.name, this, polled, poll_rate)
            }).then(() => {
                this.update_attributes({
                    polled,
                    poll_rate
                });
                return this;
            });
        },
    });
