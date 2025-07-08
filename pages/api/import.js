export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.startsWith('https://www.fupa.net/player/')) {
    return res.status(400).json({ error: 'Ungültiger Link' });
  }

  try {
    const dummyData = {
      name: 'Dogan Bezek',
      club: 'TV Hassendorf',
      appearances: 12,
      goals: 4,
      assists: 3,
      minutes: 873
    };

    const markdown = `**👤 Spieler:** ${dummyData.name}
**🏟 Verein:** ${dummyData.club}
**📅 Einsätze:** ${dummyData.appearances}
**🥅 Tore:** ${dummyData.goals}
**🎯 Assists:** ${dummyData.assists}
**⏱ Minuten gespielt:** ${dummyData.minutes}`;

    res.status(200).json({ markdown });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Daten' });
  }
}
