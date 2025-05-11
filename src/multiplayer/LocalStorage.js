export class LocalStoreage {

    static getCollection(key) {
        const collection = localStorage.getItem(key);
        return collection ? JSON.parse(collection) : null;
    }

    static updateCollection(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

}