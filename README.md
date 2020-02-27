# Umbrellot

Hey do you need an umbrella? Do you know that you need an umbrella?
Ask your friend `Umbrellot`

Umbrella uses NLP provided by messenger API, which is used to get the location
and time from the user's query.

The bot uses openweather API for weather information.

# Slides

The slides for the talk are [here](https://slides.com/swapnilraj-2/chatbot-in-101-lines/)

# Pre-requisites

- node
- npm / yarn
- ngrok

# Running on local machine

### ngrok
```
ngrok http 80
```

Make sure that the port above is the same as the port that you run your chatbot
server.

### chatbot server
```
node server.js
```

This serves your bot on port 80 by default.
