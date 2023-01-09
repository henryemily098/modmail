class Commands {
    constructor() {}
    /**
     * @param {string} folder 
     * @param {import("discord.js").Collection} collection 
     */
    set(folder, collection) {
        const fs = require("fs");
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
        for (let file of commandFiles) {
            const command = require(`../../commands/${folder}/${file}`);
            collection.set(command.name, command);
        }
    }
    /**
     * @param {string} commandName 
     * @param {import("discord.js").Collection} collection 
     * @returns 
     */
    get(commandName, collection) {
        return collection.get(commandName);
    }
    /**
     * @param {string} commandName 
     * @param {import("discord.js").Collection} collection 
     * @returns 
     */
    has(commandName, collection) {
        return collection.has(commandName)
    }
    /**
     * @param {import("discord.js").Collection} collection 
     * @returns 
     */
    toJSON(collection) {
        return collection.toJSON();
    }
}

exports.Commands = Commands;