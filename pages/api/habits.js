/*
  serverless function getting sent to edge network for cloud compute.  So I don't have to pay for a constantly running server.
  An example of FaaS (function as a service). Someone else is computing this at the request of the user.  So we don't have to.

  This environement is atomic.  Meaning it is separate from any other.  We need to call the global vars and look for a connection or establish one.

  This is a node.js environment inside a server.
*/
import db from '../../db/database';
import query from '../../db/query';

export default async (req, res) => {

   await db(); //await the connection, then do stuff
   return new Promise(resolve => {
   if (req.method === 'GET') {
     query.getHabits((data) => {
       res.send(data);
       resolve();
     })
   } 
  })
}