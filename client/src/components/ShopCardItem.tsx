import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Item } from '../types';

type ShopCardItemProps = {
  item: Item;
  action: (item: Item) => void;
};

export function ShopCardItem({ item, action }: ShopCardItemProps) {
  return (
    <Card sx={{ maxWidth: 345 }} className="centered">
      <CardContent>
        <Typography variant="h6">{item.name}</Typography>
      </CardContent>

      <CardMedia component="img" height="140" image={item.image} />

      <CardContent>
        <Typography variant="h6">Price: {item.price} gold</Typography>

        <Typography variant="h6">
          {item.stats.map((stat) => (
            <p key={stat.name}>
              +{stat.value} {stat.name}
            </p>
          ))}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => action(item)}
        >
          Buy this item
        </Button>
      </CardActions>
    </Card>
  );
}
