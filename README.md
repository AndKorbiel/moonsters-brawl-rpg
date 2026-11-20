# Moonster Brawl RPG

A browser-based turn-based RPG built with React, TypeScript, Redux, Material UI, and Firebase.

## Requirements

- Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`
- Yarn 1

## Run locally

```powershell
cd client
yarn install
yarn start
```

Vite serves the development app at `http://localhost:5173`.

## Validate and build

Run these commands from `client`:

```powershell
yarn typecheck
yarn test
yarn build
```

The production build is written to `client/build`, which is the Firebase Hosting directory configured in `firebase.json`.

Firebase settings are read from the client `.env` file using `REACT_APP_API_KEY`, `REACT_APP_FIREBASE_ID`, and `REACT_APP_SENDER_ID`. The previous `RECAT_APP_SENDER_ID` spelling is also accepted for compatibility.

Moonster images credit: [Freepik](https://pl.freepik.com/wektory/zielony).
