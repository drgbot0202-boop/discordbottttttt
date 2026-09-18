require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('DISCORD_TOKEN is missing. Put it in your .env file (locally)');
  console.error('or in the Variables tab (on Railway), then start again.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// The commands this bot answers to.
const commands = [
  { name: 'ping', description: 'Check that the bot is awake' },
  { name: 'hello', description: 'Say hello' },
];

// Newer discord.js renamed this event to 'clientReady' and logs a deprecation
// warning for 'ready'. The warning is harmless, and 'ready' still fires on
// every v14 release, so this stays compatible whichever version installs.
client.once('ready', async () => {
  console.log(`Online as ${client.user.tag}`);

  // Registering to a single server makes commands show up immediately.
  // Registering globally (no GUILD_ID) can take up to an hour the first time.
  const guildId = process.env.GUILD_ID;
  await client.application.commands.set(commands, guildId || undefined);

  console.log(
    guildId
      ? `Commands registered to server ${guildId}`
      : 'Commands registered globally (may take up to an hour to appear)'
  );
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply(`Pong! ${client.ws.ping}ms`);
  }

  if (interaction.commandName === 'hello') {
    await interaction.reply(`Hey ${interaction.user.username}!`);
  }
});

client.login(token);
