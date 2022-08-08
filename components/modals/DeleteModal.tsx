import axios from 'axios';
import { useRouter } from 'next/router';
import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import Modal from '../shared/Modal';

export default function DeleteModal({ board }: { board: IBoard }) {
  const {
    toggleDeleteModal,
    isDeleteModalOpen,
    deleteModalContent: { _id, isBoard, name, column_id },
  } = useModal();
  const router = useRouter();

  const onDelete = async () => {
    if (isBoard) {
      await axios.delete(`/api/boards/${_id}`);
      router.push('/');
    } else {
      await axios.delete(
        `/api/task/delete-task?board_id=${board._id}&column_id=${column_id}&task_id=${_id}`
      );
      toggleDeleteModal();
    }
  };

  return (
    <Modal isVisible={isDeleteModalOpen} close={toggleDeleteModal}>
      <>
        <header className='modal__header'>
          <h3 className='modal__header__title modal__header__title--delete'>
            Delete this {isBoard ? 'board' : 'task'}
          </h3>
        </header>
        <p className='modal__text'>
          Are you sure you want to delete the &apos;{name}&apos;{' '}
          {isBoard ? 'board' : 'task'}? This action will remove all columns and
          tasks and cannot be reversed.
        </p>
        <button className='modal__button__delete' onClick={onDelete}>
          Delete
        </button>
        <button
          className='modal__button__secondary'
          onClick={toggleDeleteModal}
        >
          Cancel
        </button>
      </>
    </Modal>
  );
}
