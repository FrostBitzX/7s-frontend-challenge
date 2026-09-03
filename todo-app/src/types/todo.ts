export type ItemType = 'Fruit' | 'Vegetable';

export interface Item {
  id: string;
  type: ItemType;
  name: string;
}

export interface ItemInstance {
  instanceId: string;
  item: Item;
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
