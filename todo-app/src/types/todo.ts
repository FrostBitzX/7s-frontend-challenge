export type ItemType = 'Fruit' | 'Vegetable';

export interface Item {
  id: string;       // Unique identifier: 'apple', 'broccoli', etc.
  type: ItemType;   // Category for routing to correct column
  name: string;     // Display name: 'Apple', 'Broccoli', etc.
}

export interface ItemInstance {
  instanceId: string;      // Unique per occurrence: `${itemId}-${timestamp}`
  item: Item;              // Ref. to static item data
  timerStartedAt: number | null;  // Unix timestamp
}

export interface TodoState {
  mainList: ItemInstance[];
  fruitColumn: ItemInstance[];
  vegetableColumn: ItemInstance[];
}

export type TodoAction =
  | { type: 'MOVE_TO_TYPE_COLUMN'; itemId: string; instanceId: string }
  | { type: 'RETURN_TO_MAIN'; instanceId: string }
  | { type: 'TIMER_COMPLETE'; instanceId: string };

export type TodoReducer = (state: TodoState, action: TodoAction) => TodoState;
