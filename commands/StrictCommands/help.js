const { EmbedBuilder:MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "Help command for use this bot",
    /**
     * @param {import("discord.js").Message} message 
     * @param {import("../../source/client/Client").Client} client 
     * @param {String[]} args 
     */
    async run(message, client, args) {
        let embed = new MessageEmbed()
            .setColor(message.guild.members.cache.get(client.user.id).displayHexColor)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            .setTitle("How To Use This Bot")
            .setDescription(`
Using this bot is quite easy, but also very important in helping members of this server to report something to the staff team.

This bot also has detailed information on every written rules in <#719038487214686278>. **And how does Modmail work?**

Quite simply, when someone wants to contact the staff team, I will send message in <#932132024108601415>.

**What if someone abuses this system?**
If they are the ones who are just trying or accidentally making tickets, keep an eyes on them! A member cannot make more than 1 ticket, and they need to close current ticket to make a new one to prevent abuse tickets.
`);
        message.reply({ embeds: [embed] });
    }
}