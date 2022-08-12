import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import useSWR from 'swr';
import axios from 'axios';

import { IBoard } from '@/typing';
import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import useModal from '@/contexts/useModal';

import HeadOfPage from '@/components/shared/HeadOfPage';
import Navbar from '@/components/navbar/Navbar';
import BoardModal from '@/components/modals/BoardModal';
import TaskModal from '@/components/modals/TaskModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TaskInfosModal from '@/components/modals/TaskInfosModal';
import BoardColumn from '@/components/single_board/BoardColumn';
import EmptyState from '@/components/shared/EmptyState';
import NewItem from '@/components/shared/NewItem';
import Sidebar from '@/components/sidebar/Sidebar';

interface Props {
  isrBoards: IBoard[];
  isrBoard: IBoard;
  board_id: string;
  user_id: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const SingleBoard: NextPage<Props> = ({
  isrBoards,
  isrBoard,
  board_id,
  user_id,
}) => {
  const { data: boards, error: boardsError } = useSWR<IBoard[], any>(
    `/api/boards?user_id=${user_id}`,
    fetcher,
    {
      fallbackData: isrBoards,
      revalidateOnFocus: false,
    }
  );

  const { data: board, error: boardError } = useSWR<IBoard, any>(
    `/api/boards/${board_id}`,
    fetcher,
    {
      fallbackData: isrBoard,
      revalidateOnFocus: false,
    }
  );

  const { setIsNewBoard, toggleBoardModal } = useModal();

  if (boardsError || boardError || !boards || !board) return <div>Error</div>;

  return (
    <HeadOfPage title='Board' content='Your Board'>
      <>
        <BoardModal board={board} />
        <TaskModal board={board} />
        <DeleteModal board={board} />
        <TaskInfosModal board={board} />
        <main>
          <Sidebar boards={boards} />
          <div>
            <Navbar boards={boards} board={board} />
            {board.columns.length ? (
              <div className='board__main'>
                <div className='board__main__container'>
                  {board.columns.map((column) => (
                    <BoardColumn key={column._id} column={column} />
                  ))}
                  <NewItem
                    isColumn={true}
                    onClick={() => {
                      setIsNewBoard(false);
                      toggleBoardModal();
                    }}
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                title='This board is empty. Create a new column to get started.'
                button='+ Add New Column'
                handleClick={() => {
                  setIsNewBoard(false);
                  toggleBoardModal();
                }}
              />
            )}
          </div>
        </main>
      </>
    </HeadOfPage>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/register',
      },
    };
  }

  const board_id = context.query.board_id;

  await connectMongo();

  let board = await Board.findOne({ _id: board_id });
  board = JSON.parse(JSON.stringify(board));

  let boards = await Board.find({ user_id: session.id }).select(['-columns']);
  boards = JSON.parse(JSON.stringify(boards));

  return {
    props: {
      isrBoards: boards,
      isrBoard: board,
      board_id,
      user_id: session.id,
    },
  };
};

export default SingleBoard;
