'use client';

import { useReducer } from 'react';
import { initialState, todoReducer } from '@/hooks/todoReducer';
import { useTimerManager } from '@/hooks/useTimerManager';
import { Column } from '@/components/Column';

export default function Home() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { startTimer, cancelTimer } = useTimerManager();

  const handleMainListClick = (_instanceId: string, itemId: string) => {
    const instanceId = `${itemId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    dispatch({
      type: 'MOVE_TO_TYPE_COLUMN',
      itemId,
      instanceId,
    });

    startTimer(instanceId, () => {
      dispatch({
        type: 'TIMER_COMPLETE',
        instanceId,
      });
    });
  };

  const handleTypeColumnClick = (instanceId: string) => {
    cancelTimer(instanceId);
    dispatch({
      type: 'RETURN_TO_MAIN',
      instanceId,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            items={state.mainList}
            onItemClick={handleMainListClick}
            hasBorder={false}
          />

          <Column
            title="Fruit"
            items={state.fruitColumn}
            onItemClick={handleTypeColumnClick}
            hasBorder={true}
          />

          <Column
            title="Vegetable"
            items={state.vegetableColumn}
            onItemClick={handleTypeColumnClick}
            hasBorder={true}
          />
        </div>
      </main>
    </div>
  );
}
