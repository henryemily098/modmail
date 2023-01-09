let CollectionMap = [];

class Collection {
    constructor() {
        this.size = CollectionMap.length;
    }

    set(key, value) {
        let obj = {
            key,
            construct: value
        }
        CollectionMap.push(obj);
    }

    get(key) {
        let index = CollectionMap.map(i => {
            return i.key;
        }).indexOf(key);
        let data = CollectionMap[index] ? CollectionMap[index].construct : null;
        return data;
    }

    has(key) {
        let index = CollectionMap.map(i => {
            return i.key;
        }).indexOf(key);
        let boolean = CollectionMap[index] ? true : false;
        return boolean;
    }

    forEach(callback=CollectionMap.forEach) {
        CollectionMap.forEach(value => {
            callback(value.construct);
        });
    }

    toJSON() {
        let jsonArray = [];
        for (let obj of CollectionMap) {
            jsonArray.push(obj.construct);
        }
        return jsonArray;
    }
}

exports.Collection = Collection