import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';

import { useState, useEffect } from 'react';
import { getHighScoreData } from '../../utils';
import { HighScoreData } from '../../types';

export function HighScore() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function init() {
      const highScoreData: HighScoreData[] = await getHighScoreData();
      setResults(highScoreData);
    }

    init();
  }, []);

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
              {results?.length ? (
                results.map((el) => {
                  return (
                    <TableRow key={el.id}>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>{el.level}</TableCell>
                      <TableCell>{el.date}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell>No data to display</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
