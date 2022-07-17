import axios from 'axios';

/**
 * Dad joke api finished.
 * Now just get Chuck Norris api.
 */

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const options = [
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
    const response = await axios.request(options[0]);
    res.send(response.data);
  } catch (err) {
    res.send(err);
    // const response = await axios.request(options[1]);
    // res.send(response.data);
  }
};
