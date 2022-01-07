import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import DataTable from './DataTable';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import Paper  from '@material-ui/core/Paper';
import RecipeForm from './RecipeForm';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'relative',
	  },
	appBarSeparator: {
		marginTop: theme.spacing(8),
		margin: theme.spacing(1),
		// marginTop: theme.spacing(10)
	  },
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
    	right: theme.spacing(2),
	}
}));

export default function Cookbook() {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const [refetchSwitch, triggerSwitch] = useState(false);

	const style = {
		margin: 0,
		top: 'auto',
		right: 50,
		bottom: 50,
		left: 'auto',
		position: 'fixed',
	};

	useEffect(() => {
		axiosInstance.get('cookbook/all')
			.then((response) => {
			// console.log(response.data);
			// console.log("Made a request for recipes");
			setData(response.data);
		})
			.catch((error) => console.log("Encountered an error: " + error));
		}, [refetchSwitch]);

	const refetchData = () => {
		// console.log("Refetching data");
		triggerSwitch(!refetchSwitch);
	};
		
	// console.log(data);
	return (
		// <div className={classes.root}>
		// <Paper >
		<>
		<Fab aria-label="add" style={style}>
			<RecipeForm 
				title={<AddIcon />}
				recipe={{}}
				user={localStorage.getItem('user_id')}
				refetchData={refetchData}
			/>
			
		</Fab>
		<Grid container spacing={2} className={classes.appBarSeparator}>
			{data.map((item) => (
				<Grid item xs={6}>
					<RecipeCard 
						recipe={item}
						makeExpanded={false}
						editAllowed={true}
						refetchData={refetchData}
					/>				
				</Grid>
			))}
		</Grid>
		</>
		// </Paper>
	);
}
