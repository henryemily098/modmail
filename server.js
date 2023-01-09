require("dotenv").config();
const { EmbedBuilder: MessageEmbed, ActivityType } = require("discord.js");
const { Client } = require("./source/client/Client");
const { Mongoose } = require("./source/Storage/mongoose");
const { Commands } = require("./source/Storage/Commands");

const commands = new Commands();
const client = new Client().run(process.env.TOKEN);
new Mongoose().connect(process.env.MONGODB);

commands.set("NonStrictCommands", client.nonStrictCommands);
commands.set("StrictCommands", client.strictCommands);

console.log(commands.toJSON(client.nonStrictCommands));
console.log(commands.toJSON(client.strictCommands));

client.on("ready", () => {
    console.log("Ready!");
    client.user.setActivity({ type: ActivityType.Watching, name: "DM from members." });
});

client.on("messageCreate", async(message) => {
    if(message.author.bot) return;
    const guild = client.guilds.cache.get("706744372326039573");
    await guild.members.fetch();
    const member = guild.members.cache.get(message.author.id);
    if(!member) return message.author.send(`You're not ${guild.name}'s member!`);

    if(message.guild) {
        if(!message.content.startsWith(client.config.prefix)) return;
        if(!client.checkModerationPermission(message.member)) return;

        const Ticket = require("./source/Storage/Data/ticket");
        const ticket = await Ticket.findOne({ guildId: message.guild.id });
        let data = null;
        if(ticket) {
            let index = ticket.tickets.map(i => {
                return i.userId;
            }).indexOf(message.author.id);
            data = ticket.tickets[index];
        }
        if(data) {
            if(data.channelId === message.channel.id) return message.author.send("You can't use Modmail commands in ticket channel!");
        }

        const args = message.content.slice(client.config.prefix.length).split(" ");
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName, client.strictCommands);
        if(commands.has(commandName, client.strictCommands)) return command.run(message, client, args);
    } else {
        if(!message.content.startsWith(client.config.prefix)) {
            const embed = new MessageEmbed().setColor(guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle("What can i help for you?")
                .setDescription(`Before you contact Staff team, maybe you want to read some explaining about **${guild.name}**:`)
                .addFields(
                    {
                        name: "**__1). Our Rules__**",
                        value: `All the rules and explanations are already in [#rules](https://discord.com/channels/706744372326039573/719038487214686278), if you still need a little more complete explanation, you can use the \`${client.config.prefix}rules\` command here.`,
                    },
                    {
                        name: "**__2). Verifications__**",
                        value: `FNaF Multiverse verification system is quite simple, it is in [#rules](https://discord.com/channels/706744372326039573/719038487214686278), and you only need to give your reaction in the specified reaction. If it turns out that the system doesn't work, you can use this link to verified yourself: https://glich.top/IAR8eUQ0 (second verification system can only be used when the reaction verification system doesn't work).\n\nIf it turns out that both verification systems are not working, use the \`${client.config.prefix}contact\` command here to contact the staff team.`
                    },
                    {
                        name : "**__3). Access Channels__**",
                        value: "If you are a new member, not all channels on this server can be accessed by you, there are some channels that you really have to achieve with levels or the quick way, boost this server."
                    },
                    {
                        name: "**__4). Partnership__**",
                        value: "Partnering with this server, is actually quite easy. With Discord's current advancements, it's pretty easy to qualify for a partner with us. If you feel that your server deserves to partner with us, you can contact one of our staff."
                    },
                    {
                        name: "**__5). Roleplay__**",
                        value: "In roleplay, there is no such thing as a \"permanent claim\". You can use any character, as long as when you roleplay, it relates to the storyline."
                    },
                    {
                        name: "**__6). Contest__**",
                        value: `In FNaF Multiverse, there is an art contest run by **${guild.members.cache.get("710630034083151882").user.tag}** and **${guild.members.cache.get("796789848228757514").user.tag}**. For any questions regarding this contest, you can ask them both in [#${guild.channels.cache.get("830210749640605706").name}](https://discord.com/channels/706744372326039573/830210749640605706).`
                    },
                    {
                        name: "**__7). Modmail Commands__**",
                        value: `This is list commands that you can use for Modmail:\n▫️ \`${client.config.prefix}contact\`\n▫️ \`${client.config.prefix}rules\`\n\n➖➖➖\n\nIf you still have something you need to ask, you can ask our staff team or use the command broker \`${client.config.prefix}contact\` to contact us.`
                    }
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));
            return message.author.send({ embeds: [embed] });
        }
    
        const args = message.content.slice(client.config.prefix.length).split(" ");
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName, client.nonStrictCommands);
        if(commands.has(commandName, client.nonStrictCommands)) return command.run(message, client, args);
    }
});

const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 3002;

const server = http.createServer(app);
const listener = server.listen(PORT, function() {
    console.log(`Listen to port: ${listener.address().port}`);
});

app.get("/", (req, res) => {
    res.send(`${client.user.tag} its ready!`);
});