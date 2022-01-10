import { React, useEffect, useState } from 'react';
import axiosInstance from '../axios';
import MuiLink from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Title from './Title';
import format from 'date-fns/format'

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

// const Row = (props) => {
//   const { meal }

// }

export default function Meals() {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  // const [meals, setMeals] = useState([]);

  const formattedDate = format(new Date(), 'PPPP')

  useEffect(() => {
    axiosInstance.get(`mealplan/${format(new Date(), 'y-MM-dd')}`)
      .then((response) => {
        // setData(response.data[0])
        console.log(response.data);
        if (response.data.length) {setData(response.data[0]);}
        setLoaded(true);
        // console.log(data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])



  return (
    <>
      <Title>Meal Plans for Today</Title>
      <Typography component="p" variant="h4" gutterBottom>
        {formattedDate}
      </Typography>
      <Grow in={loaded} timeout={800}>
      <Grid container spacing={2} style={{margin: 1, marginBottom: 8}} gutterBottom>
        {data.date && data["meals"].map(meal => (
          <Grid item>
          <Card >
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {meal.meal_type}
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              {meal.recipe.name}
            </Typography>
            <Typography variant="body2" component="p">
              {meal.recipe.description}
            </Typography>
          </CardContent>
        </Card>
        </Grid>
        ))
        }
      </Grid>
      </Grow>
      <div>
        <MuiLink color="primary" to="/mealplan" component={Link} underline='none'>
          View more mealplans
        </MuiLink>
      </div>
    </>
  );
}
