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
          { type: 'input_text', text: `This is an annotation canvas, ${width} by ${height} pixels. Read ONLY handwritten text or numbers. Return each readable item and its tight pixel bounding box. Do not return arrows, lines, circles, symbols, or printed background. Preserve the exact intended text, including numbers.` },
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
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: data.output_text };
  } catch (error) {
    return { statusCode: 500, body: error.message || 'Recognition failed' };
  }
};
