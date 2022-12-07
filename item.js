class Item {
    constructor(config) {
        this.itemLable = config.itemLable;
        this.itemId = config.itemId;
        
        this.color = config.color || "#555";
        this.returnValue = typeof config.returnValue === "undefined" ? true : config.returnValue;
        this.font = config.font || "17px Times New Roman";
        this.rowValue = config.rowValue || 21;
        this.text = config.text || null;
        this.textRow = config.textRow || null;
        this.textCol = config.textCol || null;
    }
}


module.exports = {
    Item,
}