import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from "react";

export default function Navbar(props) {
    return (
            <div className='navbar'>
                <Container >
                    <Grid container spacing={2}>
                        <Grid item={true} xs={8}>
                            <h2>Hello!</h2>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <h2>Current status is: {props.status}</h2>
                        </Grid>
                    </Grid>
                </Container>
            </div>
    )
}