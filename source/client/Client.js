const { Client, Collection, Partials } = require("discord.js");

exports.Client = class extends Client {
    constructor() {
        super({
            partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
            intents: [
                "DirectMessageReactions",
                "DirectMessageTyping",
                "DirectMessages",
                "GuildBans",
                "GuildEmojisAndStickers",
                "GuildIntegrations",
                "GuildInvites",
                "GuildMembers",
                "GuildMessageReactions",
                "GuildMessageTyping",
                "GuildMessages",
                "GuildPresences",
                "GuildScheduledEvents",
                "GuildVoiceStates",
                "GuildWebhooks",
                "Guilds",
                "MessageContent"
            ]
        });

        this.config = require("../Storage/config.json");
        this.nonStrictCommands = new Collection();
        this.strictCommands = new Collection();
    }

    /**
     * @param {string} token 
     * @returns 
     */
    run(token) {
        this.login(token);
        return this;
    }
    /**
     * @param {Number} length 
     * @returns 
     */
    generateId(length) {
        let results = "";
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            results += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return results;
    }
    /**
     * @param {import("discord.js").GuildMember} member 
     * @returns 
     */
    checkModerationPermission(member) {
        const Administrator = member.permissions.has("ADMINISTRATOR");
        const Manage_Server = member.permissions.has("MANAGE_GUILD");
        const Manage_Role = member.permissions.has("MANAGE_ROLES");
        const Ban_Members = member.permissions.has("BAN_MEMBERS");
        const Kick_Members = member.permissions.has("KICK_MEMBERS");
        const Manage_Messages = member.permissions.has("MANAGE_MESSAGES");
        return Administrator && Manage_Server && Manage_Role && Ban_Members && Kick_Members && Manage_Messages;
    }
}