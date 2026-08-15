export default async function handler(req, res) {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "API_FOOTBALL_KEY n'est pas configurée sur Vercel."
      });
    }

    const endpoint = req.query.endpoint || "fixtures";

    const allowedEndpoints = [
      "fixtures",
      "teams",
      "leagues",
      "players",
      "standings",
      "odds"
    ];

    if (!allowedEndpoints.includes(endpoint)) {
      return res.status(400).json({
        success: false,
        error: "Endpoint API non autorisé."
      });
    }

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
      if (key !== "endpoint" && value !== undefined && value !== "") {
        params.append(key, value);
      }
    }

    const apiUrl =
      `https://v3.football.api-sports.io/${endpoint}?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      data
    });

  } catch (error) {
    console.error("Erreur backend:", error);

    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur."
    });
  }
}
