import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import AddIcon from '@material-ui/icons/Add';
import Paper  from '@material-ui/core/Paper';
import RecipeForm from './RecipeForm';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'relative',
	},
	  container: {
		overflowY: 'scroll',
		height: '85vh',
		width: '100%',
		padding: theme.spacing(1)
	},
	appBarSeparator: {
		marginTop: theme.spacing(10),
		margin: theme.spacing(1),
		// marginTop: theme.spacing(10)
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignContent: 'center'
	
	},
	spacer: {
		visibility: 'hidden',
	},
}));

export default function Cookbook() {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const [refetchSwitch, triggerSwitch] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const fabStyle = {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 15,
		left: 'auto',
		position: 'fixed',
	};

	useEffect(() => {
		axiosInstance.get('cookbook/all')
			.then((response) => {
			// console.log(response.data);
			// console.log("Made a request for recipes");
			setData(response.data);
			setLoaded(true);
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
		<>
		<Fade in={loaded}>
		<Paper className={`${classes.appBarSeparator} ${classes.container}`}>
		<div className={classes.header}>
			<div className={classes.spacer}>spacer</div>
			<Typography variant="h5" id="tableTitle" component="div" color="primary" gutterBottom>
				Cook Book
			</Typography>

			<RecipeForm 
				title={<AddIcon />}
				recipe={{}}
				user={localStorage.getItem('user_id')}
				refetchData={refetchData}
			/>
		</div>
		<Divider style={{marginBottom: 12}}/>
		<Grid container spacing={2} 
		// className={classes.appBarSeparator}
		>
			{data.map((item) => (
				<Grid item xs={6}>
					{/* <Fade in={true}> */}
					<RecipeCard 
						recipe={item}
						makeExpanded={false}
						editAllowed={true}
						refetchData={refetchData}
					/>				
					{/* </Fade> */}
				</Grid>
			))}
		</Grid>
		</Paper>
		</Fade>
		</>
	);
}
