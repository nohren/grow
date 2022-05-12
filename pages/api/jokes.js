import axios from 'axios';

/**
 * First try is random.  If fails Chuck Norris api.
 *
 */

export default async (req, res) => {
  const optionsJokes = {
    method: 'GET',
    url: 'https://dad-jokes.p.rapidapi.com/random/joke',
    headers: {
      'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPID_API,
    },
  };

  const optionsChuckNorris = {
    method: 'GET',
    url: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',
    headers: {
      accept: 'application/json',
      'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPID_API,
    },
  };

  const getRandomOption = () => {
    const options = [optionsJokes, optionsChuckNorris];
    return options[Math.floor(Math.random() * options.length)];
  };

  try {
    const randomOption = getRandomOption();
    const response = await axios.request(randomOption);
    res.send(response.data?.body[0] ?? response.data);
  } catch (err) {
    const response = await axios.request(optionsChuckNorris);
    res.send(response.data);
  }
};
