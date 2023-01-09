const { EmbedBuilder:MessageEmbed } = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Checking open ticket!",
    /**
     * @param {import("discord.js").Message} message 
     * @param {import("../../source/client/Client").Client} client 
     * @param {String[]} args 
     */
    async run(message, client, args) {
        const guild = client.guilds.cache.get("706744372326039573");
        const Ticket = require("../../source/Storage/Data/ticket");
        const ticket = await Ticket.findOne({ guildId: message.guild.id });
        if(args.length < 1) return message.reply("You must input a valid ticket Id to close ticket! Check <#932132024108601415>!");
        
        let index = ticket.tickets.map(i => {
            return i.customId;
        }).indexOf(args[0]);
        let data = ticket.tickets[index];
        if(!data) return this.run(message, client, []);

        const member = guild.members.cache.get(data.userId);
        const receiveChannel = guild.channels.cache.get("932132024108601415");
        if(!receiveChannel) return;
        if(receiveChannel.isText()) {
            const msgs = await receiveChannel.messages.fetch();
            const existingMsg = await msgs.get(data.messageId);
            if(existingMsg) {
                let embed = new MessageEmbed().setColor(guild.members.cache.get(client.user.id).displayHexColor)
                    .setAuthor({ name: member ? member.user.tag : "user#0000", iconURL: member ? member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) : "https://fnafmultiverse.herokuapp.com/discord-icon.png" })
                    .addFields(
                        {
                            name: "Ticket Id:",
                            value: data.customId,
                            inline: true
                        },
                        {
                            name: "Channel:",
                            value: "Has Been Deleted",
                            inline: true
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setFooter({ text: `Opened Date: ${new Date(data.date).toLocaleDateString()} | Closed Date: ${new Date().toLocaleDateString()}`, iconURL: "http://www.clipartbest.com/cliparts/dT8/5e6/dT85e6aqc.png" });
                existingMsg.edit({ embeds: [embed], content: `Ticket has been closed by **${message.author.tag}**!` });
            }
        }

        guild.channels.cache.get(data.channelId).delete(`Ticket Close by ${message.author.tag}`);
        ticket.tickets.splice(index, 1);
        ticket.save();

        return message.reply(`Closed ticket with Id: **${data.customId}**!`);
    }
}