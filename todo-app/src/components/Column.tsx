import type { ItemInstance } from '@/types/todo';
import { TodoButton } from './TodoButton';

export interface ColumnProps {
  title?: string;
  items: ItemInstance[];
  onItemClick: (instanceId: string, itemId: string) => void;
  hasBorder?: boolean;
}

export function Column({
  title,
  items,
  onItemClick,
  hasBorder = true,
}: ColumnProps) {
  return (
    <div
      className={`flex flex-col h-[650px] w-full ${
        hasBorder
          ? 'border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/30 dark:bg-zinc-900/20'
          : ''
      } overflow-hidden`}
    >
      {title && (
        <div className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 py-2.5 px-4 text-center">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {title}
          </h2>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto space-y-2.5 ${
          hasBorder ? 'p-2.5' : 'py-0 px-1'
        }`}
      >
        {items.map((instance) => (
          <TodoButton
            key={instance.instanceId}
            instanceId={instance.instanceId}
            item={instance.item}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
