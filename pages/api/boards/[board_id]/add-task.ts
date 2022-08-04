import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IColumn } from '@/typing';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { board_id },
  } = req;
  await connectMongo();

  if (method === 'PATCH') {
    const { column_id, task } = body;

    const board = await Board.findOne({ _id: board_id });

    const columnToUpdate = board.columns.find(
      (c: IColumn) => c._id.toString() == column_id
    );

    columnToUpdate.tasks.push(task);

    const boardUpdated = await board.save();

    res.status(200).json(boardUpdated);
  }
}
