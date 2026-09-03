import type { Item } from '@/types/todo';

export interface TodoButtonProps {
  item: Item;
  instanceId: string;
  onClick: (instanceId: string, itemId: string) => void;
}

export function TodoButton({
  item,
  instanceId,
  onClick,
}: TodoButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(instanceId, item.id)}
      className="w-full py-3 px-4 text-center font-medium text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 active:scale-[0.99] transition cursor-pointer"
    >
      {item.name}
    </button>
  );
}
