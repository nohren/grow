import axios from 'axios';

/**
 * First try is random.  If fails, get Chuck Norris api.
 */

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const options = [
    {
      method: 'GET',
      url: 'https://dad-jokes.p.rapidapi.com/random/joke',
      headers: {
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API,
      },
    },
    {
      method: 'GET',
      url: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',
      headers: {
        accept: 'application/json',
        'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPID_API,
      },
    },
  ];

  const getRandomOption = () =>
    options[Math.floor(Math.random() * options.length)];

  try {
    const response = await axios.request(getRandomOption());
    res.send(response.data?.body[0] ?? response.data);
  } catch (err) {
    const response = await axios.request(options[1]);
    res.send(response.data);
  }
};
