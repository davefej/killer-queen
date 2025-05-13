export class LocalStorage {

    getCollection(key) {
        const collection = localStorage.getItem(key);
        return collection ? JSON.parse(collection) : null;
    }

    updateCollection(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    addToCollection(key, value) {
        const collection = this.getCollection(key) || [];
        collection.push(value);
        this.updateCollection(key, collection);
    }

}