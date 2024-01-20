export const getNewNameEffect = () => {
  return new Promise<string>((resolve, reject) => {
    fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then((res) => res.json())
      .then((data) => {
        resolve(data[0].charAt(0).toUpperCase() + data[0].slice(1));
      })
      .catch((e) => {
        console.error(e);
        reject('MooNsterOpp');
      });
  });
};
