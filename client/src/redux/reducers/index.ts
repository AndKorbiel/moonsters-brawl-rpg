import game from './game';
import character from './character';
import shop from './shop';
import opponent from './opponent';
import user from './user';
import { Reducer, combineReducers } from 'redux';
import { GAME_OVER, LOAD_GAME } from '../constants/game';
import { ActionType, AppState } from '../../types';
import { normalizeShopState } from '../../data/shopStock';
import { buyItem, calculateStatsFromItem } from '../actions/character';
import { removeFromShop } from '../actions/shop';
import { BUY_FROM_SHOP } from '../constants/shop';

const appReducer: Reducer<AppState, ActionType> = combineReducers({
  game,
  character,
  shop,
  opponent,
  user,
});

export const rootReducer = (state: AppState, action: ActionType) => {
  switch (action.type) {
    case BUY_FROM_SHOP: {
      const { slotId, item } = action.payload;
      const slot = state.shop.slots.find((shopSlot) => shopSlot.id === slotId);
      const alreadyOwnsType = state.character.items.some(
        (ownedItem) => ownedItem.type === item.type,
      );
      if (
        !slot ||
        slot.item?.id !== item.id ||
        state.character.gold < item.price ||
        alreadyOwnsType
      ) {
        return state;
      }

      const purchaseState = appReducer(state, action);
      const boughtItemState = appReducer(purchaseState, buyItem(item));
      const clearedSlotState = appReducer(
        boughtItemState,
        removeFromShop(slotId),
      );
      return appReducer(
        clearedSlotState,
        calculateStatsFromItem(item.stats),
      );
    }
    case GAME_OVER:
      return appReducer(undefined, action);
    case LOAD_GAME:
      return {
        ...state,
        game: action.payload.game,
        character: action.payload.character,
        opponent: action.payload.opponent,
        shop: normalizeShopState(
          action.payload.shop,
          action.payload.character.level,
        ),
      };
    default:
      return appReducer(state, action);
  }
};
