import useModal from '@/contexts/useModal';
import { ITask } from '@/typing';

interface Props {
  isVisible: boolean;
  close: () => void;
  task: ITask;
}

export default function TaskDropdown({ isVisible, close, task }: Props) {
  const {
    toggleTaskModal,
    setTaskModalContent,
    toggleDeleteModal,
    setDeleteModalContent,
  } = useModal();

  return (
    <div
      className={
        isVisible
          ? 'edit__dropdown edit__dropdown--open task__dropdown'
          : 'edit__dropdown task__dropdown'
      }
    >
      <button
        className='edit__button__edit'
        onClick={() => {
          close();
          setTaskModalContent({ isNew: false, task });
          toggleTaskModal();
        }}
      >
        Edit Task
      </button>
      <button
        className='edit__button__delete'
        onClick={() => {
          close();
          toggleDeleteModal();
          setDeleteModalContent({
            isBoard: false,
            name: task.title,
            _id: task!._id!.toString(),
            column_id: task.status,
          });
        }}
      >
        Delete Task
      </button>
    </div>
  );
}
