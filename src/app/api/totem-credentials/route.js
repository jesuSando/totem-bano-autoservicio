import https from "https";
import fetch from "node-fetch";

const TOKEN = process.env.API_TOKEN;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return new Response(JSON.stringify({ error: "Falta IP del tótem" }), { status: 400 });
    }

    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await fetch(`https://${ip}:4000/get_credentials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-auth": TOKEN,
      },
      agent,
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Error obteniendo credenciales: ${response.status}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("[API] getCredentials error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
