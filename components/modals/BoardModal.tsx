import { useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

import useModal from '@/contexts/useModal';
import { IBoard, ITask } from '@/typing';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';

interface IControllerColumn {
  _id?: string;
  name: string;
  tasks: ITask[] | [];
}

interface IControllerBoard {
  name: string;
  columns: IControllerColumn[];
}

const defaultValues = {
  name: '',
  columns: [
    { name: 'Todo', tasks: [] },
    { name: 'Doing', tasks: [] },
  ],
};

export default function BoardModal({ board }: { board?: IBoard }) {
  const { data: session } = useSession();
  const { isBoardModalOpen, toggleBoardModal, isNewBoard } = useModal();
  const router = useRouter();
  const { control, handleSubmit, reset, setValue } = useForm<IControllerBoard>({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  useEffect(() => {
    if (!isNewBoard && board) {
      setValue('name', board.name);
      setValue('columns', board.columns);
    } else {
      setValue('name', '');
      setValue('columns', [
        { name: 'Todo', tasks: [] },
        { name: 'Doing', tasks: [] },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewBoard, board]);

  const onSubmit: SubmitHandler<IControllerBoard> = async (data) => {
    if (isNewBoard) {
      const newBoard = await axios.post(`/api/boards?user_id=${session?.id}`, {
        board: data,
      });

      router.push(`/board/${newBoard.data._id}`);
      mutate(`/api/boards?user_id=${session?.id}`);
    } else {
      await axios.patch(`/api/boards/${board!._id}?user_id=${session?.id}`, {
        ...data,
      });
      mutate(`/api/boards/${board!._id}?user_id=${session?.id}`);

      if (board?.name !== data.name) {
        mutate(`/api/boards?user_id=${session?.id}`);
      }
    }
    toggleBoardModal();
  };

  return (
    <Modal
      isVisible={isBoardModalOpen}
      close={() => {
        toggleBoardModal();
        if (isNewBoard) {
          reset(defaultValues);
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='modal__header'>
          <h3 className='modal__header__title'>
            {isNewBoard ? 'Add New Board' : 'Edit Board'}
          </h3>
        </header>
        <Controller
          control={control}
          name='name'
          rules={{ required: "can't be empty" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputTextControl
              onChange={onChange}
              value={value}
              error={error}
              name='name'
              label='Board Name'
              placeholder='e.g. Web Design'
            />
          )}
        />
        <div className='input__array__container'>
          <label className='input__label'>Board Columns</label>
          <div className='input__array__fields'>
            {fields.map((column, id) => (
              <Controller
                key={column.id}
                control={control}
                defaultValue={column.name}
                name={`columns.${id}.name`}
                rules={{ required: "can't be empty" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <InputArrayControl
                    onChange={onChange}
                    value={value}
                    error={error}
                    remove={() => remove(id)}
                  />
                )}
              />
            ))}
          </div>
          <button
            className='modal__button__secondary'
            type='button'
            onClick={() => append({ name: '', tasks: [] })}
          >
            + Add New Column
          </button>
        </div>
        <button className='modal__button__primary__s' type='submit'>
          {isNewBoard ? 'Create New Board' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}
