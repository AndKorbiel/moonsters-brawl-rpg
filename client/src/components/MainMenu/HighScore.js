import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';

export function HighScore() {
  const [results, setResults] = useState([]);
  const highScoreRef = collection(db, 'high-score');

  const sortData = (data) => {
    return data
      .sort((a, b) => {
        return a.level - b.level;
      })
      .reverse()
      .slice(0, 10);
  };

  useEffect(() => {
    async function getData() {
      const data = await getDocs(highScoreRef);

      try {
        const highScoreData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const sorted = sortData(highScoreData);
        setResults(sorted);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [highScoreRef]);

  return (
    <Box maxWidth="xl" className="centered text-centered menu-table">
      <Card className="padlr">
        <h1>High score</h1>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Character name</TableCell>
                <TableCell>Character Level</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {results.length > 1 &&
                results.map((el) => {
                  return (
                    <TableRow key={el.id}>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>{el.level}</TableCell>
                      <TableCell>{el.date}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
