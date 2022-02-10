import {useSelector} from 'react-redux';
import { db } from '../../firebase-config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LoadGame from "./LoadGame";
import Button from '@mui/material/Button';
import {useState} from 'react';
import Alert from '@mui/material/Alert';

export default function SaveGame() {
    const state = useSelector(state => state);
    const gameCollectionRef = collection(db, 'games');
    state.game.date = new Date().toLocaleDateString("en-GB");
    const [status, setStatus] = useState(false);

    const handleSetStatus = () => {
        setStatus(true);
        setTimeout(()=> {
            setStatus(false);
        }, 2000);
    }

    const saveGame = async () => {
        await addDoc(gameCollectionRef, state);
        handleSetStatus();
    }

    const handleOverwriteGame = async (id) => {
        const gameDoc = doc(db, 'games', id);
        await updateDoc(gameDoc, state);
        handleSetStatus();
    }

    return (
        <Box maxWidth="xl" className="centered text-centered">
            <Card className="padlr">
                <h1>Save your game</h1>
                {status ? <Alert severity="success">Game saved</Alert> : ''}
                <LoadGame mode="save" action={handleOverwriteGame} />
                <Button variant="contained" color="secondary" onClick={()=> saveGame()}>Save new game</Button>
            </Card>
        </Box>
    )
}