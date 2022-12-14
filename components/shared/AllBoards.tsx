import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import useTheme from '@/contexts/useTheme';

interface Props {
  boards: IBoard[];
  className: string;
  close?: () => void;
}
export default function AllBoards({ boards, className, close }: Props) {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { board_id } = router.query;

  return (
    <div className={className}>
      <div>
        <p className='board__numbers'>all boards ({boards.length})</p>
        <div className='board__items'>
          {boards.map((item) => (
            <Link href={`/board/${item._id}`} passHref key={item._id}>
              <a>
                <div
                  className={
                    board_id === item._id
                      ? 'board__item board__item--active'
                      : 'board__item'
                  }
                  onClick={close}
                >
                  <Image
                    src='/assets/icon-board.svg'
                    width={16}
                    height={16}
                    layout='fixed'
                    alt='board'
                    className='board__item__logo'
                  />
                  <h3 className='board__item__name'>{item.name}</h3>
                </div>
              </a>
            </Link>
          ))}
          <button
            className='board__item__button'
            onClick={() => {
              close && close();
              setIsNewBoard(true);
              toggleBoardModal();
            }}
          >
            <Image
              src='/assets/icon-board.svg'
              width={16}
              height={16}
              alt='board'
              className='board__item__button__logo'
            />
            <h3 className='board__item__button__text'>+ Create New Board</h3>
          </button>
        </div>
      </div>
      <div>
        <div className='board__theme'>
          <Image
            src='/assets/icon-light-theme.svg'
            width={19}
            height={19}
            alt='board'
          />
          <button className='board__theme__switch' onClick={toggleTheme}>
            <div className='board__theme__switch__circle'></div>
          </button>
          <Image
            src='/assets/icon-dark-theme.svg'
            width={16}
            height={16}
            alt='board'
          />
        </div>
        <button
          className='board__logout'
          onClick={() => signOut({ callbackUrl: '/register' })}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
