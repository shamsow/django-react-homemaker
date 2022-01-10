import { React, useEffect, useState} from "react";
import axiosInstance from '../axios';

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "auto",
	},
	paper: {
		// width: 350,
		height: 230,
		overflow: "auto",
	},
	button: {
		margin: theme.spacing(0.5, 0),
	},
	cardHeader: {
		padding: theme.spacing(1, 2),
	},
}));

function intersection(a, b) {
	const exists = (value, object) => {
		return object.findIndex(x => x.id == value.id)
	}
	  return a.filter(value => exists(value, b))
}

export default function TransferList(props) {
	const { ingredients, updateIngredients } = props;
	const classes = useStyles();
	const [checked, setChecked] = useState([]);
	const [allIngredients, setIngredients] = useState([]);
	const inRecipe = ingredients.length? ingredients : [];

	useEffect(() => {
		axiosInstance.get("pantry/all")
			.then((response) => {
			setIngredients(response.data);
			setChecked(intersection(inRecipe, allIngredients));
		})
		  	.catch((error) => console.log(error));
	}, []);

	const handleToggle = (value) => () => {
		const currentIndex = checked.findIndex(x => x.id == value.id);
		const newChecked = [...checked];

		if (currentIndex === -1) {
		newChecked.push(value);
		} else {
		newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const updateRecipeForm = () => {
		console.log("Updating recipe form...");
		console.log(checked);
		updateIngredients(checked);
	}

	const customList = (items, title) => (
		<>
		<Typography variant="body2" gutterBottom>{title}</Typography>
		<Paper className={classes.paper}>
		
		<List dense component="div" role="list">
			{items.map((value) => {
			const labelId = `transfer-list-item-${value.id}-label`;

			return (
				<ListItem
				key={value.id}
				role="listitem"
				button
				onClick={handleToggle(value)}
				>
				<ListItemIcon>
					<Checkbox
					checked={checked.findIndex(x => x.id == value.id) !== -1}
					tabIndex={-1}
					disableRipple
					inputProps={{ "aria-labelledby": labelId }}
					/>
				</ListItemIcon>
				<ListItemText id={labelId} primary={`${value.name}`} />
				</ListItem>
			);
			})}
			<ListItem />
		</List>
		</Paper>
		</>
	);

	return (
		<Grid
		container
		spacing={2}
		justifyContent="center"
		alignItems="center"
		className={classes.root}
		>
		<Grid item xs={12}>{customList(allIngredients, "Ingredients")}</Grid>
		<Grid item>
			<Grid container direction="column" alignItems="center">
			<Button
				variant="outlined"
				size="small"
				className={classes.button}
				onClick={updateRecipeForm}
				aria-label="update recipe form"
			>
				Set Ingredients
			</Button>
			</Grid>
		</Grid>
		{/* <Grid item>{customList(inRecipe, "Ingredients in Recipe")}</Grid> */}
		</Grid>
	);
}
