import { Item } from '../../types';
import { REMOVE_FROM_SHOP } from '../constants/shop';

export function removeFromShop(item: Item) {
  return {
    type: REMOVE_FROM_SHOP,
    payload: item,
  };
}
