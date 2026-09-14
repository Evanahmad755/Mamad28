// Kirim DM lewat bot Discord pakai REST API langsung (gak perlu library
// discord.js). Butuh env DISCORD_BOT_TOKEN — bot yang SAMA yang dipakai buat
// bikin akun UCP (jadi udah pasti satu server sama user-usernya, syarat wajib
// biar bot bisa DM orang).

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const discordEnabled = Boolean(DISCORD_BOT_TOKEN);

async function sendDiscordDM(discordId, content) {
  if (!discordEnabled) throw new Error('DISCORD_BOT_TOKEN belum diisi.');

  const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient_id: discordId }),
  });
  if (!dmRes.ok) {
    throw new Error(`Gagal buka DM channel (${dmRes.status}): ${await dmRes.text()}`);
  }
  const channel = await dmRes.json();

  const msgRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!msgRes.ok) {
    throw new Error(`Gagal kirim DM (${msgRes.status}): ${await msgRes.text()}`);
  }
}

module.exports = { discordEnabled, sendDiscordDM };
