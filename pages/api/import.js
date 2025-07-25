export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.startsWith('https://www.fupa.net/player/')) {
    return res.status(400).json({ error: 'Ungültiger FuPa-Link' });
  }

  try {
    const browseRes = await fetch('https://api.browse.ai/v2/tasks/2e3d73ea-b238-44b0-9638-0db8368e677f/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BROWSE_AI_API_KEY}`
      },
      body: JSON.stringify({
        input: { url },
        immediate: true
      })
    });

    const browseData = await browseRes.json();

    const result = browseData?.result?.tables?.[0]?.rows?.[0];

    if (!result) {
      return res.status(500).json({ error: 'Keine Daten von Browse.ai erhalten.' });
    }

    const markdown = `**👤 Spieler:** ${result.name}
**🏟 Verein:** ${result.club}
**📅 Einsätze:** ${result.appearances}
**🥅 Tore:** ${result.goals}
**🎯 Assists:** ${result.assists}
**⏱ Minuten gespielt:** ${result.minutes}`;

    res.status(200).json({ markdown });
  } catch (error) {
    console.error('Browse.ai Fehler:', error);
    res.status(500).json({ error: 'Fehler bei der Datenabfrage' });
  }
}
