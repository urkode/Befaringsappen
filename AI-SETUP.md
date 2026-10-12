# AI handwriting recognition setup

The app uses an OpenAI vision model through a Netlify Function. This keeps the API key off the phone.

1. Put this project in a GitHub repository and import that repository into Netlify. A Git-based deploy is required for the `netlify/functions/recognize.js` server function.
2. In Netlify: **Site configuration > Environment variables**, create `OPENAI_API_KEY` with an OpenAI project API key as its value.
3. Trigger a new deploy.
4. Open the site on a phone, draw a number or short word, then tap `T` with the sparkle.

Do not put the API key in `app.js`, `index.html`, or any browser-visible setting.

The recognizer sends the marked-up drawing layer to the API when the user taps the conversion button. The original photo is not sent by this action. The returned text remains editable and movable before the image is exported.
