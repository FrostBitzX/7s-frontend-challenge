import { todoReducer, initialState } from '../../hooks/todoReducer';

describe('todoReducer', () => {
  describe('initial state', () => {
    it('should have all 11 items in the main list', () => {
      expect(initialState.mainList).toHaveLength(11);
      expect(initialState.fruitColumn).toHaveLength(0);
      expect(initialState.vegetableColumn).toHaveLength(0);
    });

    it('should use item.id as the initial instanceId', () => {
      expect(initialState.mainList[0].instanceId).toBe('apple');
      expect(initialState.mainList[0].item.name).toBe('Apple');
    });
  });

  describe('MOVE_TO_TYPE_COLUMN', () => {
    it('should move a Fruit item to the fruit column', () => {
      const result = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-123',
      });

      expect(result.mainList.find((i) => i.item.id === 'apple')).toBeUndefined();
      expect(result.mainList).toHaveLength(10);
      expect(result.fruitColumn).toHaveLength(1);
      expect(result.fruitColumn[0].item.name).toBe('Apple');
      expect(result.fruitColumn[0].instanceId).toBe('apple-123');
      expect(result.vegetableColumn).toHaveLength(0);
    });

    it('should move a Vegetable item to the vegetable column', () => {
      const result = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'broccoli',
        instanceId: 'broccoli-123',
      });

      expect(result.mainList.find((i) => i.item.id === 'broccoli')).toBeUndefined();
      expect(result.mainList).toHaveLength(10);
      expect(result.vegetableColumn).toHaveLength(1);
      expect(result.vegetableColumn[0].item.name).toBe('Broccoli');
      expect(result.fruitColumn).toHaveLength(0);
    });

    it('should return same state reference if item is not found', () => {
      const result = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'nonexistent',
        instanceId: 'non-123',
      });

      expect(result).toBe(initialState);
    });

    it('should not move an item that is already in a type column', () => {
      const stateAfterMove = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-123',
      });

      // apple is no longer in mainList, so this should be a no-op
      const result = todoReducer(stateAfterMove, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-456',
      });

      expect(result).toBe(stateAfterMove);
    });

    it('should assign the provided instanceId to the moved item', () => {
      const result = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'mango',
        instanceId: 'mango-custom-id',
      });

      expect(result.fruitColumn[0].instanceId).toBe('mango-custom-id');
    });

    it('should append to the existing type column, not replace it', () => {
      let state = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-1',
      });
      state = todoReducer(state, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'banana',
        instanceId: 'banana-1',
      });

      expect(state.fruitColumn).toHaveLength(2);
      expect(state.fruitColumn[0].item.name).toBe('Apple');
      expect(state.fruitColumn[1].item.name).toBe('Banana');
    });
  });

  describe('RETURN_TO_MAIN', () => {
    it('should return a fruit item to the bottom of the main list', () => {
      const stateWithFruit = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-123',
      });

      const result = todoReducer(stateWithFruit, {
        type: 'RETURN_TO_MAIN',
        instanceId: 'apple-123',
      });

      expect(result.fruitColumn).toHaveLength(0);
      expect(result.mainList).toHaveLength(11);
      // returned item should be at the bottom
      const lastItem = result.mainList[result.mainList.length - 1];
      expect(lastItem.item.name).toBe('Apple');
    });

    it('should return a vegetable item to the bottom of the main list', () => {
      const stateWithVeg = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'broccoli',
        instanceId: 'broccoli-123',
      });

      const result = todoReducer(stateWithVeg, {
        type: 'RETURN_TO_MAIN',
        instanceId: 'broccoli-123',
      });

      expect(result.vegetableColumn).toHaveLength(0);
      expect(result.mainList).toHaveLength(11);
      const lastItem = result.mainList[result.mainList.length - 1];
      expect(lastItem.item.name).toBe('Broccoli');
    });

    it('should return same state reference if instance is not found', () => {
      const result = todoReducer(initialState, {
        type: 'RETURN_TO_MAIN',
        instanceId: 'nonexistent',
      });

      expect(result).toBe(initialState);
    });

    it('should only remove the specific instance from a column with multiple items', () => {
      let state = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-1',
      });
      state = todoReducer(state, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'banana',
        instanceId: 'banana-1',
      });

      expect(state.fruitColumn).toHaveLength(2);

      const result = todoReducer(state, {
        type: 'RETURN_TO_MAIN',
        instanceId: 'apple-1',
      });

      expect(result.fruitColumn).toHaveLength(1);
      expect(result.fruitColumn[0].instanceId).toBe('banana-1');
    });
  });

  describe('TIMER_COMPLETE', () => {
    it('should behave the same as RETURN_TO_MAIN', () => {
      const stateWithFruit = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'orange',
        instanceId: 'orange-123',
      });

      const result = todoReducer(stateWithFruit, {
        type: 'TIMER_COMPLETE',
        instanceId: 'orange-123',
      });

      expect(result.fruitColumn).toHaveLength(0);
      expect(result.mainList).toHaveLength(11);
      const lastItem = result.mainList[result.mainList.length - 1];
      expect(lastItem.item.name).toBe('Orange');
    });

    it('should return same state reference if instance is not found', () => {
      const result = todoReducer(initialState, {
        type: 'TIMER_COMPLETE',
        instanceId: 'nonexistent',
      });

      expect(result).toBe(initialState);
    });
  });

  describe('state immutability', () => {
    it('should not mutate the previous state on MOVE_TO_TYPE_COLUMN', () => {
      const mainListBefore = [...initialState.mainList];

      todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-123',
      });

      expect(initialState.mainList).toEqual(mainListBefore);
      expect(initialState.mainList).toHaveLength(11);
    });

    it('should not mutate the previous state on RETURN_TO_MAIN', () => {
      const stateWithFruit = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-123',
      });

      const fruitColumnBefore = [...stateWithFruit.fruitColumn];

      todoReducer(stateWithFruit, {
        type: 'RETURN_TO_MAIN',
        instanceId: 'apple-123',
      });

      expect(stateWithFruit.fruitColumn).toEqual(fruitColumnBefore);
      expect(stateWithFruit.fruitColumn).toHaveLength(1);
    });
  });

  describe('full cycle', () => {
    it('should handle a complete move-and-return cycle correctly', () => {
      // Move apple to fruit column
      const afterMove = todoReducer(initialState, {
        type: 'MOVE_TO_TYPE_COLUMN',
        itemId: 'apple',
        instanceId: 'apple-cycle',
      });

      expect(afterMove.mainList).toHaveLength(10);
      expect(afterMove.fruitColumn).toHaveLength(1);

      // Return apple to main list (simulating timer completion)
      const afterReturn = todoReducer(afterMove, {
        type: 'TIMER_COMPLETE',
        instanceId: 'apple-cycle',
      });

      expect(afterReturn.mainList).toHaveLength(11);
      expect(afterReturn.fruitColumn).toHaveLength(0);
      expect(afterReturn.mainList[afterReturn.mainList.length - 1].item.id).toBe('apple');
    });
  });
});
