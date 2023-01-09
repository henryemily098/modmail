const Ticket = require("../../source/Storage/Data/ticket");
const { EmbedBuilder:MessageEmbed, ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "contact",
    description: "Create ticket to contact staff team!",
    /**
     * @param {import("discord.js").Message} message 
     * @param {import("../../source/client/Client").Client} client 
     * @param {String[]} args 
     */
    async run(message, client, args) {
        const guild = client.guilds.cache.get("706744372326039573");
        await guild.members.fetch({ member: true, withPresences: true });

        let data = await Ticket.findOne({ guildId: guild.id });
        let index = data.tickets.map(i => {
            return i.userId;
        }).indexOf(message.author.id);
        let ticket = data.tickets[index];

        if(args.length < 1) {
            let embed = new MessageEmbed().setColor(guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle("Do you wan to contact us?")
                .setDescription(`
If you want to contact us, use \`create\` method to create a ticket. For example:
\`\`\`
${client.config.prefix}contact create
\`\`\`
And if you want to close the ticket, use \`close\` method to close a ticket. For example:
\`\`\`
${client.config.prefix}contact close
\`\`\`
`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            try {
                return await message.author.send({ embeds: [embed] });
            } catch (error) {
                return console.log(error);
            }
        }

        if(args[0].toLowerCase() !== "close" && args[0].toLowerCase() !== "create") {
            let embed = new MessageEmbed().setColor(guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle("Do you wan to contact us?")
                .setDescription(`
If you want to contact us, use \`create\` method to create a ticket. For example:
\`\`\`
${client.config.prefix}contact create
\`\`\`

And if you want to close the ticket, use \`close\` method to close a ticket. For example:
\`\`\`
${client.config.prefix}contact close
\`\`\`
`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
            try {
                return await message.author.send({ embeds: [embed] });
            } catch (error) {
                return console.log(error);
            }
        }
        
        if(args[0].toLowerCase() === "close") {
            if(!ticket) return message.author.send("You don't open any ticket!");
            const receiveChannel = guild.channels.cache.get("932132024108601415");
            if(receiveChannel.isTextBased()) {
                const msgs = await receiveChannel.messages.fetch();
                const existingMsg = msgs.get(ticket.messageId)
                const member = guild.members.cache.get(ticket.userId);

                let embed = new MessageEmbed()
                    .setColor(guild.members.cache.get(client.user.id).displayHexColor)
                    .setAuthor({ name: member ? member.user.tag : "user#0000", iconURL: member ? member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) : null })
                    .setFields([
                        {
                            name: "Ticket Id:",
                            value: ticket.customId,
                            inline: true
                        },
                        {
                            name: "Channel:",
                            value: "Has Been Deleted",
                            inline: true
                        }
                    ])
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setFooter({ text: `Opened Date: ${new Date(ticket.date).toLocaleDateString()} | Closed Date: ${new Date().toLocaleDateString()}`, iconURL: "http://www.clipartbest.com/cliparts/dT8/5e6/dT85e6aqc.png" });
                existingMsg.edit({ embeds: [embed], content: `Ticket has been closed by **${member ? member.user.tag : "user#0000"}**!` });
            }

            guild.channels.cache.get(ticket.channelId).delete(`${ticket.customId} has been closed!`);
            data.tickets.splice(index, 1);
            data.save();

            try {
                return await message.author.send("Tickets are closed! Thank you for trusting us!");
            } catch (error) {
                console.log(error);
            }
        } else if(args[0].toLowerCase() === "create") {
            if(ticket) {
                try {
                    return await message.author.send("You have opened a ticket! You must close the current ticket to open a new one!")
                } catch (error) {
                    return console.log(error);
                }
            }
            
            const customId = client.generateId(8);
            const date = new Date();

            let channel = null;
            try {
                channel = await guild.channels.create({
                    name: `📨│${customId}`,
                    parent: "931845201335550002",
                    type: ChannelType.GuildText,
                    topic: `${message.author.tag} opened ticket!\nId: ${customId}`,
                    reason: `${message.author.tag} has opened new ticket! Please respond to them, maybe it's emergency (or not).`,
                    permissionOverwrites: [
                        {
                            id: client.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages
                            ]
                        },
                        {
                            id: message.author.id,
                            allow: [
                                PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.AttachFiles
                            ],
                            deny: [
                                PermissionFlagsBits.UseApplicationCommands
                            ]
                        },
                        {
                            id: "862700534058582017",
                            allow: [
                                PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.AttachFiles
                            ],
                            deny: [
                                PermissionFlagsBits.UseApplicationCommands
                            ]
                        },
                        {
                            id: "791637881868517376",
                            allow: [
                                PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.AttachFiles
                            ],
                            deny: [
                                PermissionFlagsBits.UseApplicationCommands
                            ]
                        },
                        {
                            id: "706767620078305352",
                            allow: [PermissionFlagsBits.ViewChannel],
                            deny: [
                                PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory
                            ]
                        }
                    ]
                });
            } catch (error) {
                return console.log(error);
            }

            let receiveMessage = null;
            const receiveChannel = guild.channels.cache.get("932132024108601415");
            if(receiveChannel.isTextBased()) {
                let embed = new MessageEmbed().setColor(guild.members.cache.get(client.user.id).displayHexColor)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) })
                    .addFields(
                        {
                            name: "Ticket Id:",
                            value: customId,
                            inline: true
                        },
                        {
                            name: "Channel:",
                            value: `<#${channel.id}>`,
                            inline: true
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                    .setFooter({ text: `Opened Date: ${date.toLocaleDateString()} | Closed Date: Not yet`, iconURL: "http://cdn.onlinewebfonts.com/svg/img_569588.png" });
                receiveMessage = await receiveChannel.send({ embeds: [embed], content: `**${message.author.tag}** its open the ticket!` })
            }

            let obj = {
                userId: message.author.id,
                channelId: channel.id,
                customId: customId,
                messageId: receiveMessage.id,
                date: date
            }

            data.tickets.push(obj);
            data.save();

            try {
                await message.author.send(`**Ticket is open! Please click this link to enter your ticket channel!**\n<https://discord.com/channels/${guild.id}/${channel.id}>`);
            } catch (error) {
                console.log(error);
            }
        }
    }
}