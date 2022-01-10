import React from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import DashMeals from './components/DashMeals';
import DashIngredients from './components/DashIngredients';
import DashRecipes from './components/DashRecipes';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Sadat '}
      {new Date().getFullYear()}
      <br/>
      {<Link color="inherit" href="https://mui.com/">
        Powered by Material UI
      </Link>}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    // overflow: 'auto',
    flexDirection: 'column',
  },
  mealPaper: {
    // height: 240,
    padding: theme.spacing(4),
    width: '100%'
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.mealPaper);

  // const dateToday = 

  return (
      // <main>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Recent Deposits */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <DashMeals />
              </Paper>
            </Grid>
            {/* Recent Ingredients */}
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <DashIngredients />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <DashRecipes />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
  );
}
