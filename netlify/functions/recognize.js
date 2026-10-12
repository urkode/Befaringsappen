exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 500, body: 'OPENAI_API_KEY is not configured' };
  try {
    const { image, width, height } = JSON.parse(event.body || '{}');
    if (!image || !width || !height) return { statusCode: 400, body: 'Missing image dimensions' };

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              text: { type: 'string' },
              box: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  x0: { type: 'number' }, y0: { type: 'number' },
                  x1: { type: 'number' }, y1: { type: 'number' }
                },
                required: ['x0', 'y0', 'x1', 'y1']
              }
            },
            required: ['text', 'box']
          }
        }
      },
      required: ['items']
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        store: false,
        input: [{ role: 'user', content: [
          { type: 'input_text', text: `This is a white ${width} by ${height} pixel canvas containing ONLY the user's drawn ink strokes. Return text or digits ONLY when you can directly see clear, deliberate handwritten letter or digit shapes in the ink. Never guess, infer, autocomplete, correct, or invent text. If a mark is unclear, an arrow, a line, a circle, a tick, a dimension line, a symbol, or a drawing, OMIT it. Do not describe the image. An empty items array is always better than a guessed result. For each accepted item, use a tight bounding box around only its ink.` },
          { type: 'input_image', image_url: image, detail: 'high' }
        ] }],
        text: { format: { type: 'json_schema', name: 'annotations', strict: true, schema } }
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI recognition request failed', response.status, errorBody);
      return { statusCode: response.status, body: errorBody };
    }
    const data = await response.json();
    const outputText = data.output_text || data.output
      ?.flatMap(item => item.content || [])
      .find(content => content.type === 'output_text')?.text;
    if (!outputText) {
      console.error('OpenAI returned no text output', JSON.stringify(data).slice(0, 800));
      return { statusCode: 502, body: 'OpenAI returned no readable text output' };
    }
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: outputText };
  } catch (error) {
    return { statusCode: 500, body: error.message || 'Recognition failed' };
  }
};
