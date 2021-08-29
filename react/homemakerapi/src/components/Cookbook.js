import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import DataTable from './DataTable';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
// props.address => api endpoint 	 	String
// props.title => data identity  	 	String
// props.headings => table headers 		Array
// props.fields => object fields 		Array

const useStyles = makeStyles((theme) => ({
	appBarSeparator: {
		marginTop: theme.spacing(8),
		margin: theme.spacing(1),
		// marginTop: theme.spacing(10)
	  },
}));

export default function Cookbook() {
	const classes = useStyles();
	const [data, setData] = useState([]);

	useEffect(() => {
		axiosInstance.get('cookbook/all')
			.then((response) => {
			// console.log(response.data);
			// console.log("Made a request for recipes");
			setData(response.data);
		})
			.catch((error) => console.log("Encountered an error: " + error));
		}, []);
	// console.log(data);
	return (
		// <div className={classes.appBarSeparator}>
		<Grid container spacing={2} className={classes.appBarSeparator}>
			{data.map((item) => (
				<Grid item xs={3}>
					<RecipeCard 
						id={item.id}
						title={item.name}
						date={new Date(item.modified)}
						ingredients={item.ingredients}
						description={item.description}
						instructions={item.instructions}
					/>				
				</Grid>
			))}
			
			{/* <Grid item xs={3}>
				<RecipeCard />				
			</Grid>
			<Grid item xs={3}>
				<RecipeCard />				
			</Grid>
			<Grid item xs={3}>
				<RecipeCard />				
			</Grid>
			<Grid item xs={3}>
				<RecipeCard />				
			</Grid> */}
		</Grid>
	);
}
//   export default Pantry;