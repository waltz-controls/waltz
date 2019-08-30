export default class MultiMap {
    constructor(){
        this.map = new Map();
    }

    put(k, v){
        if(this.map.get(k) === undefined){
            this.map.set(k,[])
        }
        this.map.get(k).push(v);
    }

    get(k){
        if(this.map.get(k) === undefined){
            this.map.set(k,[])
        }
        return this.map.get(k);
    }

    size(){
        return this.map.size();
    }

    removeAll(k){
        const values = this.get(k);
        values.length = 0;
    }

    remove(k, v){
        const values = this.get(k);

        const indexOf = values.indexOf(v);
        if(indexOf > -1)
            values.splice(indexOf, 1);
    }
}