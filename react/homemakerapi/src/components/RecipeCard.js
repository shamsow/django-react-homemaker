import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import RecipeForm from './RecipeForm';
import Chip from '@material-ui/core/Chip';
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
        subheader={new Date(recipe.created).toUTCString()}
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
          <ExpandMoreIcon />
        </IconButton>
        
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
		  <Typography paragraph>Ingredients: 
		  	
			  {recipe.ingredients.map((ingredient) => (
				  <Typography variant="caption" display="block" gutterBottom>{ingredient.name}</Typography>
			  ))}

		  </Typography>
          <Typography paragraph>Method:
			<Typography variant="caption" display="block" gutterBottom>
				{recipe.instructions}
			</Typography>
		  </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}