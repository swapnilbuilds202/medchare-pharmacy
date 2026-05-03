export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `You are a friendly AI assistant for MedCare Pharmacy in Dharamsala, Himachal Pradesh, India. Help customers with:
- Medicine availability: Paracetamol 500mg Rs18/strip, Azithromycin 250mg Rs85/strip, Cetirizine 10mg Rs22/strip, Metformin 500mg Rs35/strip, Omeprazole 20mg Rs28/strip, Amoxicillin 500mg Rs65/strip, Ibuprofen 400mg Rs20/strip, Dolo 650 Rs30/strip
- Timings: Mon-Fri 8am-10pm, Sat 8am-9pm, Sun 10am-6pm, Holidays 10am-4pm
- Home delivery within 2 hours in Dharamsala area
- WhatsApp: +91 98765 43210
Keep replies SHORT (2-4 sentences), warm, helpful. For serious conditions always suggest seeing a doctor.`,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.content?.find(b => b.type === 'text')?.text || "Sorry, please call us at +91 98765 43210!";
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Sorry, I am offline right now. Please WhatsApp us at +91 98765 43210!" });
  }
}
