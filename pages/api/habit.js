import db from '../../db/database';
import query from '../../db/query';

export default async (req, res) => {
   await db(); //await the connection, then do stuff
   return new Promise(resolve => {
     if (req.method === 'PUT') {
      query.updateHabit(req.body, (err, response) => {
          if (err) res.send(err)
          else res.send(response);
          resolve();
      })
     } else if (req.method === 'DELETE'){
      query.deleteHabit(req.body, (err, response) => {
          if (err) res.send(err)
          else res.send(response);
          resolve();
      });
     }
   })
}