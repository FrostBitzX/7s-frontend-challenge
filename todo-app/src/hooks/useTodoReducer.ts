import { initialItems } from '@/data/items';
import type { ItemInstance, TodoAction, TodoState } from '@/types/todo';

export const initialState: TodoState = {
  mainList: initialItems.map((item): ItemInstance => ({
    instanceId: item.id,
    item,
    timerStartedAt: null,
  })),
  fruitColumn: [],
  vegetableColumn: [],
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'MOVE_TO_TYPE_COLUMN': {
      const instanceIndex = state.mainList.findIndex(
        (inst) => inst.item.id === action.itemId
      );

      if (instanceIndex === -1) { // check if item not found in main list
        return state;
      }

      const instance = state.mainList[instanceIndex];
      const newMainList = state.mainList.filter((_, i) => i !== instanceIndex);

      const movedInstance: ItemInstance = {
        instanceId: action.instanceId,
        item: instance.item,
        timerStartedAt: Date.now(),
      };

      if (instance.item.type === 'Fruit') {
        return {
          ...state,
          mainList: newMainList,
          fruitColumn: [...state.fruitColumn, movedInstance],
        };
      } else {
        return {
          ...state,
          mainList: newMainList,
          vegetableColumn: [...state.vegetableColumn, movedInstance],
        };
      }
    }

    case 'RETURN_TO_MAIN':
    case 'TIMER_COMPLETE': {
      const fromFruit = state.fruitColumn.find(
        (inst) => inst.instanceId === action.instanceId
      );
      const fromVegetable = state.vegetableColumn.find(
        (inst) => inst.instanceId === action.instanceId
      );

      const found = fromFruit ?? fromVegetable;

      if (!found) {
        return state;
      }

      const returnedInstance: ItemInstance = {
        ...found,
        timerStartedAt: null,
      };

      return {
        mainList: [...state.mainList, returnedInstance],
        fruitColumn: fromFruit
          ? state.fruitColumn.filter((inst) => inst.instanceId !== action.instanceId)
          : state.fruitColumn,
        vegetableColumn: fromVegetable
          ? state.vegetableColumn.filter((inst) => inst.instanceId !== action.instanceId)
          : state.vegetableColumn,
      };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}