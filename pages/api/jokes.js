import axios from 'axios';
const API_KEY = process.env.RAPID_API;
/**
 * First try is to the jokes API.  If fails Chuck Norris api.
 *
 */

export default async (req, res) => {
  const optionsJokes = {
    method: 'GET',
    url: 'https://dad-jokes.p.rapidapi.com/random/joke',
    headers: {
      'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
      'X-RapidAPI-Key': API_KEY,
    },
  };

  const optionsChuckNorris = {
    method: 'GET',
    url: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',
    headers: {
      accept: 'application/json',
      'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
      'X-RapidAPI-Key': API_KEY,
    },
  };

  try {
    const response = await axios.request(optionsJokes);
    res.send(response.data?.body[0]);
  } catch (err) {
    const response = await axios.request(optionsChuckNorris);
    res.send(response.data);
  }
};
