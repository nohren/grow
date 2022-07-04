import db from '../../db/database';
import {
  updateHabit,
  deleteHabit,
  updateIndex,
  insertHabit,
  getIndex,
  getGfx,
} from '../../db/query';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    await db();

    if (req.method === 'PUT') {
      res.send(await updateHabit(req.body));
    } else if (req.method === 'DELETE') {
      res.send(await deleteHabit(req.body));
    } else if (req.method === 'POST') {
      const gfxData = await getGfx();
      const { index } = await getIndex();
      const gfxInstance = gfxData[index];

      //increment index or reset
      if (index >= gfxData.length - 1) {
        await updateIndex(0);
      } else {
        await updateIndex(index + 1);
      }
      res.send(await insertHabit(req.body, gfxInstance));
    }
  } catch (e) {
    res.send(e);
  }
};
