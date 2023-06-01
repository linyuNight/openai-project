import { Configuration, OpenAIApi } from "openai";
import axios from 'axios'

const configuration = new Configuration({
  organization: "org-P0yMVVQrfhFyViGirXhf6sT6",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: animal,
    //   temperature: 0.6,
    // });

    // res.status(200).json({ result: completion.data.choices[0].text });
    // res.status(200).json({ result: completion.data.choices[0].text });

    axios.post('https://api.openai.com/v1/chat/completions', 
    {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": animal}]
    },{
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${configuration.apiKey}`
      }
    }).then(result => {
      res.status(200).json({ result: result.data.choices[0].message.content });
    })
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return `Suggest three names for an animal that is a superhero.

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
// }
