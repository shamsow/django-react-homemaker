import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import RecipeForm from './RecipeForm';

// date-fns
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import formatRelative from 'date-fns/formatRelative';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper  from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    minWidth: '100%',
  }
  
}));

export default function RecipeCard(props) {
  const { recipe, makeExpanded, editAllowed, refetchData } = props;
	// console.log(recipe);
  const classes = useStyles();
  const [expanded, setExpanded] = useState(makeExpanded);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const createdDate = parseISO(recipe.created);
  const modifiedDate = parseISO(recipe.modified);
  const dateString = isAfter(modifiedDate, createdDate) 
                      ? `${format(createdDate, 'PPPPpp')} (edited ${formatRelative(modifiedDate, new Date(), {addSuffix: true})})`
                      : `${format(createdDate, 'PPPPpp')}`

  return (
    <Card className={classes.card} key={recipe.id}>
      <CardHeader
        // avatar={
        //   // <Avatar aria-label="recipe" className={classes.avatar}>
        //   //   R
        //   // </Avatar>
        //   editAllowed?
        //   <RecipeForm title={<EditIcon />} recipe={recipe} refetchData={refetchData}/>
        //   : ''
        // }
        // action={editAllowed?
        //   <IconButton aria-label="settings" onClick={handleDelete}>
        //     <EditIcon />
        //   </IconButton>
        //   : ''
        // }
        action={
        editAllowed?
        <RecipeForm title={<EditIcon />} recipe={recipe} refetchData={refetchData}/>
        : ''
        }
        title={recipe.name}
        subheader={dateString}
      />
      {/* <CardMedia
        className={classes.media}
        image="https://source.unsplash.com/random"
        title="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
         {recipe.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {recipe.rating && <Chip variant="outlined" color="primary" label={`${recipe.rating}/10`}/>}
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton> */}
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon color="primary"/>
        </IconButton>
        
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
		  <Typography paragraph>Ingredients 
		  	<Grid container spacing={1}>
			  {recipe.ingredients.map((ingredient) => (
          <Grid item>
				  {/* <Typography variant="caption" display="block" gutterBottom>{ingredient.name}</Typography> */}
          <Chip label={ingredient.name} variant="outlined" size="small"></Chip>
          </Grid>
			  ))}
        </Grid>
        </Typography>
        <Paper variant="outlined" style={{padding: 10}}>
        <Typography paragraph>Method
        <Typography variant="caption" display="block" gutterBottom>
          {recipe.instructions}
        </Typography>
        </Typography>
        </Paper>
        </CardContent>
      </Collapse>
    </Card>
  );
}