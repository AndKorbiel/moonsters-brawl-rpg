import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import {loadGame} from '../../redux/actions/game';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function LoadGame() {
    const gameCollectionRef = collection(db, 'games');
    const [savedGames, setSavedGames] = useState([])
    const dispatch = useDispatch();

    useEffect(async ()=> {
        const data = await getDocs(gameCollectionRef)
        const savedGames = data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setSavedGames(savedGames);
    }, [])

    const handleLoadGame = (savedGame) => {
        dispatch(loadGame(savedGame))
    }

    return (
        <div>
            <h1>Hello!</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Character name</TableCell>
                            <TableCell>Character Level</TableCell>
                            <TableCell>Character gold</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {savedGames.length > 0 && savedGames.map(savedGame => {
                            return (
                                <TableRow>
                                    <TableCell>{savedGame.character.name}</TableCell>
                                    <TableCell>{savedGame.character.level}</TableCell>
                                    <TableCell>{savedGame.character.gold}</TableCell>
                                    <TableCell>{savedGame.date}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" onClick={()=>handleLoadGame(savedGame)}>Load game</Button>
                                    </TableCell>
                                </TableRow>
                                )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default LoadGame;