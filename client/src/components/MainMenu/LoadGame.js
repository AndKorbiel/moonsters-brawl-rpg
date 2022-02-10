import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import { db } from '../../firebase-config';
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';
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
import Box from '@mui/material/Box';

function LoadGame(props) {
    const gameCollectionRef = collection(db, 'games');
    const [savedGames, setSavedGames] = useState([])
    const dispatch = useDispatch();

    useEffect(()=> {
        let isDataSubscribed = true;
        async function getData() {
            const data = await getDocs(gameCollectionRef)
            const savedGames = data.docs.map(doc => ({
                ...doc.data(),
                game: {
                    ...doc.data().game,
                    id: doc.id
                }
            }))
            if (isDataSubscribed) {
                setSavedGames(savedGames);
            }
        }
        getData();

        return ()=> {
            isDataSubscribed = false;
        }
    }, [gameCollectionRef])

    const handleLoadGame = (savedGame) => {
        dispatch(loadGame(savedGame))
    }

    const deleteSavedGame = async (id) => {
        const gameDoc = doc(db, 'games', id);
        await deleteDoc(gameDoc)
    }

    return (
        <Box maxWidth="xl" className="centered text-centered load-game">
            {props.mode === 'save' ? '' : <h1>Load game</h1>}
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
                                <TableRow key={savedGame.game.id}>
                                    <TableCell>{savedGame.character.name}</TableCell>
                                    <TableCell>{savedGame.character.level}</TableCell>
                                    <TableCell>{savedGame.character.gold}</TableCell>
                                    <TableCell>{savedGame.game.date}</TableCell>
                                    <TableCell>
                                        {props.mode === 'save' ?
                                            <Button variant="contained" onClick={()=>props.action(savedGame.game.id)}>Overwrite game</Button>
                                            : <><Button variant="contained" onClick={()=>handleLoadGame(savedGame)}>Load game</Button>
                                              <Button variant="contained" color="error" onClick={()=>deleteSavedGame(savedGame.game.id)}>Delete game</Button>
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                                )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default LoadGame;