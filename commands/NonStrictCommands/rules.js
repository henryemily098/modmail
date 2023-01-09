const { rules } = require("../../source/Storage/rules.json");
const { EmbedBuilder:MessageEmbed } = require("discord.js");

module.exports = {
    name: "rules",
    description: "Explain about rules",
    /**
     * @param {import("discord.js").Message} message 
     * @param {import("../../source/client/Client").Client} client 
     * @param {String[]} args 
     */
    async run(message, client, args) {
        if(args.length < 1) return message.author.send("📃 You must enter a number of the rules between 1 - 9!");
        if(isNaN(args[0])) return message.author.send("You must enter a valid number to get the detail of the rules!");
        
        var number = parseInt(args[0]);
        const guild = client.guilds.cache.get("706744372326039573");
        if(1 > number > 9) return message.author.send("You must enter a number between 1 - 9!").catch(console.log);

        const channel = client.channels.cache.get("719038487214686278");
        if(channel.isTextBased()) {
            const msgs = await channel.messages.fetch();
            const msg = msgs.get("768319316651147284");

            let rule = msg.embeds[0].fields[number - 1];
            const embed = new MessageEmbed()
                .setColor(guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle(rule.name)
                .setDescription(rule.value)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));
            try {
                await message.author.send({ embeds: [embed] });
            } catch (error) {
                console.log(error);
            }
        }
    }
}