import React, { useEffect, useState } from 'react';

import { ITask } from '@/typing';
import useModal from '@/contexts/useModal';

export default function BoardTask({ task }: { task: ITask }) {
  const { setTaskInfosModalContent, toggleTaskInfosModal } = useModal();
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);

  useEffect(() => {
    setSubtasksCompleted(
      task.subtasks.reduce((acc, curr) => {
        curr.isCompleted && (acc += 1);
        return acc;
      }, 0)
    );
  }, [task]);

  return (
    <article
      className='board__task'
      onClick={() => {
        setTaskInfosModalContent(task);
        toggleTaskInfosModal();
      }}
    >
      <h3 className='board__task__title'>{task.title}</h3>
      <p className='board__task__text'>
        {subtasksCompleted} of {task.subtasks.length} subtasks
      </p>
    </article>
  );
}
