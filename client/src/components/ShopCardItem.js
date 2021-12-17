import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from "react";

export default function ShopCardItem(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography variant="h6">
                    {props.item.name}
                </Typography>
            </CardContent>
            <CardMedia
                component="img"
                height="140"
                image={props.item.image}
            />
            <CardContent>
                <Typography variant="h6">
                    Price: {props.item.price} gold
                </Typography>
                <Typography variant="h6">
                    {props.item.stats.map(stat => {
                        return (
                            <p key={stat.name}>+{stat.value} {stat.name}</p>
                        )
                    })}
                </Typography>
            </CardContent>
        </Card>
    )
}