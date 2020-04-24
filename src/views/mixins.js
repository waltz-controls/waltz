export const BoundedReverseList = {
    limit : 100,
    addFirst(item) {
        const id = this.add(item);
        this.moveTop(id);
        while (this.data.count() > (this.config.limit || this.limit)) {
            this.remove(this.getLastId());
        }
    }
}

//TODO instead of webix mixin this should be WaltzWidget extension
export const Stateful = {
    /**
     *
     * @param state
     */
    restoreState(state){

    },

    async updateAndSafeState(){
        const context = await this.config.userContextController.get();
        Object.assign(context[this.getStateId()], this.state);
        this.config.userContextController.save()
    },

    async setAndSafeState(){
        const context = await this.config.userContextController.get();
        context[this.getStateId()] = this.state;
        this.config.userContextController.save()
    },

    getInitialState() {
        return Object.create(null)
    },
    getStateId() {
        return this.config.id;
    },
    state: null,

    $init:function(config){
        if(config.userContextController === null || config.userContextController === undefined) throw new Error(`Can not initialize stateful Widget[${this.config.id}]: config.userContext is null or undefined!`);

        config.userContextController.get().then(userContext => {
            this.state = userContext[this.getStateId()] || this.getInitialState();

            this.restoreState(state);
            console.debug(`Widget[${this.config.id}] state[${this.getStateId()}] is restored.`);
        });
    }
}