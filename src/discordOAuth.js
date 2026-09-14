// OAuth2 "Login with Discord" — dipakai buat VERIFIKASI IDENTITAS sebelum
// orang boleh bikin UCP baru dari website, supaya satu Discord cuma bisa
// punya satu UCP (dicek dari DiscordID beneran, bukan cuma modal isi form).
//
// BEDA sama DISCORD_BOT_TOKEN (src/discord.js) yang dipakai buat KIRIM DM.
// Ini butuh Client ID & Client Secret dari tab "OAuth2" di aplikasi Discord
// yang sama (discord.com/developers/applications -> bot lu -> OAuth2).

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || '';
const oauthEnabled = Boolean(CLIENT_ID && CLIENT_SECRET && REDIRECT_URI);

function getAuthorizeUrl(state) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

async function exchangeCodeForUser(code) {
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Token exchange gagal (${tokenRes.status}): ${await tokenRes.text()}`);
  const tokenData = await tokenRes.json();

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) throw new Error(`Ambil profil Discord gagal (${userRes.status})`);
  return userRes.json(); // { id, username, ... }
}

module.exports = { oauthEnabled, getAuthorizeUrl, exchangeCodeForUser };
