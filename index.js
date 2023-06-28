const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = "OTAyNDAzMzU2Njk2Mzg3NjE1.GE6nMO.9d4zazchU6oEOdv7lyV-oI4X5ulkRTu5kak4O0";

const incrementLeaderboard = (leaderboard, user) => {
    let userElem = null;
    
    leaderboard.forEach((elem) => {
        if (elem.user === user) {
            userElem = elem;
            userElem.count++;
        }
    });
    
    if (userElem == null) {
        userElem = {user: user, count: 1};
        leaderboard.push(userElem);
    }

    return userElem;
};

const printLeaderboard = (leaderboard, title, channel) => {
    channel.send("**" + title + "**");
    leaderboard.forEach((elem) => {
        channel.send(elem.user + ": " + elem.count);
    });
};

const printHotwordQuote = (message, word) => {
    let output = "";

    let wordIndex = 0;
    let prevBold = false;
    Array.from(message.content.toLowerCase()).forEach((char, index) => {
        if(char === word[wordIndex]) {
            wordIndex++;
            if (!prevBold) {
                output += "**";
                prevBold = true;
            }
            output += message.content[index];
        } else {
            if (prevBold) {
                prevBold = false;
                output += "**";
            }
            output += message.content[index];
        }
    });
    if (prevBold) {
        output += "**";
    }

    message.channel.send(output);
    console.log(message.author.username + ": " + output);
};

const incrementSusmeter = () => {
    let increment = Math.floor((Math.random() * 12) + 1);
    let timeout = (Math.random() ** 10 * 1000 * 60 * 60 * 24 * 5);
    susmeter += increment;
    updateStatus();
    setTimeout(() => {
        susmeter -= increment;
        updateStatus();
    }, timeout);
    console.log("increment: " + increment + " timeout: " + timeout);
};

const updateStatus = () => {
    client.user.setActivity('susmeter at ' + susmeter + '%', { type: 'WATCHING' });
};

const hotwords = [
    {word: "amogus", action: (message, hotword) => {
        printHotwordQuote(message, hotword.word);
        incrementLeaderboard(hotword.leaderboard, message.author.username);
        incrementSusmeter();
        // printLeaderboard(hotword.leaderboard, "amogus leaderboard", message.channel);
    }, leaderboard: []}, 
    {word: "sus", action: (message, hotword) => {
        printHotwordQuote(message, hotword.word);
        incrementLeaderboard(hotword.leaderboard, message.author.username);
        incrementSusmeter();
        // printLeaderboard(hotword.leaderboard, "sussy leaderboard", message.channel);
    }, leaderboard: []}, 
    {word: "vent", action: (message, hotword) => {
        const channels = client.channels.cache.get("General");
        console.log(channels);
        message.member.voice.setChannel();
    }},
    {word: "leaderboard", action: (message, hotword) => {
        printHotwordQuote(message, hotword.word);
        incrementLeaderboard(hotword.leaderboard, message.author.username);
        printLeaderboard(hotwords[0].leaderboard, "amogus leaderboard", message.channel);
        printLeaderboard(hotwords[1].leaderboard, "sussy leaderboard", message.channel);
        printLeaderboard(hotword.leaderboard, "leaderboard leaderboard", message.channel);
    }, leaderboard: []}];

let susmeter = 0;

client.once('ready', () => {
    console.log("amogusbot is online!");
    updateStatus();
});

client.on('messageCreate', message => {
    if (!message.author.bot) {
        // console.log(message.content);
        let hotwordsIndex = new Array(hotwords.length).fill(0);
        let hotwordSearching = true;
        if (Math.random() > 0.975) {
            hotwordSearching = false;
            message.channel.send("**sus**");
            incrementLeaderboard(hotwords[0].leaderboard, message.author.username);
            incrementSusmeter();
        }
        Array.from(message.content.toLowerCase()).forEach((char) => {
            hotwords.forEach((hotword, index) => {
                if (hotwordSearching && char === hotword.word[hotwordsIndex[index]]) {
                    hotwordsIndex[index]++;
                    if (hotwordsIndex[index] === hotword.word.length) {
                        hotword.action(message, hotword);
                        hotwordSearching = false;
                    }
                }
            });
        });
    }
});

client.login(token);
