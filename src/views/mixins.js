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