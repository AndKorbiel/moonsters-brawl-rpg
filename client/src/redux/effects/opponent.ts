import type { Dispatch } from 'redux';
import { setName } from '../actions/opponent';

export const getNewNameEffect = () => {
  return (dispatch: Dispatch) => {
    fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then((res) => res.json())
      .then((data) => {
        let name = data[0].charAt(0).toUpperCase() + data[0].slice(1);
        dispatch(setName(name));
      });
  };
};
