import React from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import { Link, useLocation } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import KitchenIcon from '@material-ui/icons/Kitchen';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LayersIcon from '@material-ui/icons/Layers';

const useListStyles = makeStyles((theme) => ({
  active: {
    backgroundColor: '#E7EAF9',
    color: '#2d3b8b',
  }
}));

const ListIcon = (props) => {
  const location = useLocation();
  const color = props.to==location.pathname? 'primary' : '';

  return  <ListItemIcon>
            {React.cloneElement(props.icon, { color:  color})}
          </ListItemIcon>
}

function ListItemLink(props) {
  const location = useLocation();
  const classes = useListStyles();
  // console.log(props);
  return <ListItem
            className={clsx({[classes.active] : props.to==location.pathname})}
            // selected={props.to==location.pathname} 
            button 
            component={Link} 
            {...props} 
          />;
}

export const mainListItems = (
  <div>
    <ListItemLink to="/">
      <ListIcon to="/" icon={<DashboardIcon/>}/>
      <ListItemText primary="Dashboard" />
    </ListItemLink>

    <ListItemLink to="/pantry">
      <ListIcon to="/pantry" icon={<KitchenIcon/>}/>
      <ListItemText primary="Pantry" />
    </ListItemLink>

    <ListItemLink to="/cookbook">
      <ListIcon to="/cookbook" icon={<CollectionsBookmarkIcon/>}/>
      <ListItemText primary="Cookbook" />
    </ListItemLink>

    <ListItemLink to="/mealplan">      
      <ListIcon to="/mealplan" icon={<FastfoodIcon/>}/>
      <ListItemText primary="Meal Plans" />
    </ListItemLink>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Testing</ListSubheader>
     <ListItemLink to="/api">
      <ListIcon to="/api" icon={<LayersIcon/>}/>
      <ListItemText primary="API Test" />
    </ListItemLink>
  </div>
);
