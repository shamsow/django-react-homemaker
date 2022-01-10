import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	textField: {
	  marginLeft: theme.spacing(1),
	  marginRight: theme.spacing(1),
	  width: '25ch',
	},
  }));
  
const LayoutTextFields = (props) => {
	const { meal, user, refetchData, closeForm } = props;
	// console.log(meal);
	const classes = useStyles();
	const initialMealTypes = [
		{
			"value": "Breakfast",
			"display_name": "Breakfast"
		},
		{
			"value": "Lunch",
			"display_name": "Lunch"
		},
		{
			"value": "Dinner",
			"display_name": "Dinner"
		},
		{
			"value": "Snack",
			"display_name": "Snack"
		}
	]

	const initialFormData = Object.freeze({
		meal_type: meal["meal_type"] ? meal["meal_type"] : '',
		date: meal["date"] ? meal["date"] : '',
		recipe: meal["recipe"] ? meal["recipe"].id : '',
		user: user
	});

	const initialErrors = Object.freeze({
		meal_type: '',
		date: '',
		recipe: '',
	});

	const [formData, updateFormData] = useState(initialFormData);
	const [mealTypes, updateMealTypes] = useState(initialMealTypes);
	const [recipeData, setRecipeData] = useState([]);
	const [errors, setErrors] = useState(initialErrors)

	useEffect(() => {
		axiosInstance.options("mealplan/meal/create")
		  .then((response) => {
		  // console.log(response.data);
		  updateMealTypes(response.data.actions.POST.meal_type.choices);
		})
		  .catch((error) => console.log(error));
		
		axiosInstance.get("cookbook/all")
		  .then((response) => {
		  // console.log(response.data);
		  setRecipeData(response.data);
		})
		  .catch((error) => console.log(error));

	  }, []);

	const handleChange = (e, field) => {
		// console.log(e);
		updateFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleUpdate = (e) => {
		e.preventDefault()
		console.log("Updating meal...");
		// console.log(formData);
		axiosInstance
			.put(`mealplan/meal/${meal["id"]}`, formData)
			.then((res) => {
				console.log("Succesfully updated!");
				refetchData();
				closeForm();
			})
			.catch((error) => {
				console.log("Encountered an error.")
				console.log(error.response.data);
				const errorResponse = error.response.data;
				const newErrors = {
					meal_type: errorResponse["meal_type"]? errorResponse["meal_type"][0] : '',
					date: errorResponse["date"]? errorResponse["date"][0] : '',
					recipe: errorResponse["recipe"]? errorResponse["recipe"][0] : '',
				};
				setErrors(newErrors);
				
			});
	};

	const handleCreate = (e) => {
		e.preventDefault()
		console.log("Creating new meal...");
		// console.log(formData);
		axiosInstance
			.post(`mealplan/meal/create`, formData)
			.then((res) => {
				console.log("Succesfully created!");
				refetchData();
				closeForm();
			})
			.catch((error) => {
				console.log("Encountered an error.")
				console.log(error.response.data);
				const errorResponse = error.response.data;
				const newErrors = {
					meal_type: errorResponse["meal_type"]? errorResponse["meal_type"][0] : '',
					date: errorResponse["date"]? errorResponse["date"][0] : '',
					recipe: errorResponse["recipe"]? errorResponse["recipe"][0] : '',
				};
				setErrors(newErrors);
			});
	};
  
	return (
	  <div className={classes.root}>
		<div>
		<form noValidate>
		  <TextField
		  	required
			id="outlined-full-width"
			label="Date"
			type='date'
			style={{ margin: 8 }}
			defaultValue={meal["date"] ? meal["date"] : ""}
			fullWidth
			margin="normal"
			name="date"
			helperText="YYYY-MM-DD"
			InputLabelProps={{
			  shrink: true,
			}}
			onChange={handleChange}
			error={errors["date"].length? true : false}
			helperText={errors["date"].length? errors["date"] : ''}
		  />
		  <TextField
			select
			required
			label="Meal Type"
			className={classes.textField}
			defaultValue={meal["meal_type"] ? meal["meal_type"] : ""}
			value={formData["meal_type"]}
			onChange={handleChange}
			margin="dense"
			name="meal_type"
			error={errors["meal_type"].length? true : false}
			helperText={errors["meal_type"].length? errors["meal_type"] : ''}
			// disabled={meal["item-unit"]? true: false}
			>
			{mealTypes.map((mealType) => (
				<MenuItem key={mealType["value"]} value={mealType["value"]}>
				{mealType["display_name"]}
				</MenuItem>
			))}
			</TextField>
			<TextField
				select
				required
				label="Recipe"
				id="outlined-margin-dense"
				defaultValue={meal["recipe"] ? meal["recipe"]["id"] : ""}
				value={formData["recipe"]}
				className={classes.textField}
				margin="dense"
				name="recipe"
				onChange={handleChange}
				error={errors["recipe"].length? true : false}
				helperText={errors["recipe"].length? errors["recipe"] : ''}
			>
			{recipeData.map((recipe) => (
				<MenuItem key={recipe["id"]} value={recipe["id"]}>
				{recipe["name"]}
				</MenuItem>
			))}
			</TextField>
		  <Button
			type="submit"
			fullWidth
			variant="contained"
			color="primary"
			onClick={meal["meal_type"]? handleUpdate: handleCreate}
			startIcon={<EditIcon/>}
			style={{marginTop: 12}}
			>
				{meal["meal_type"]? "Update": "Create"}
			</Button>
		  </form>
		</div>
	  </div>
	);
  }


export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
//   console.log(props);
	const refetchData = props["refetchData"];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (e) => {
	const endPoint = props["mealID"]? `mealplan/${props["mealID"]}` : `mealplan/meal/${props["meal"]["id"]}`;

	console.log(`Deleting ${endPoint}`);

	axiosInstance
		.delete(endPoint)
		.then((res) => {
			console.log("Succesfully deleted!");
			refetchData();
		})
		.catch((error) => {
			console.log("Encountered an error.")
			console.log(error.response.data);
		});
  }

  return (
	<div>
	<Tooltip title={props["meal"]["meal_type"]? "Edit Meal": "Create Meal"}>
	<IconButton color="primary" onClick={handleClickOpen}>
		{props.title}
	</IconButton>
	</Tooltip>
	{(props["meal"]["meal_type"] || props["mealID"]) &&
	<Tooltip title={"Delete meal"}>
	<IconButton color="secondary" onClick={handleDelete}>
		<DeleteIcon/>
	</IconButton>
	</Tooltip>
	}
	<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<DialogTitle id="form-dialog-title">{props["meal"]["meal_type"]? "Update ": "Create "}Meal</DialogTitle>
		<DialogContent>
		{/* <DialogContentText>
			
		</DialogContentText> */}
		<LayoutTextFields
			meal={props["meal"]}
			user={props["user"]}

			refetchData={props["refetchData"]}
			closeForm={handleClose}
		/>
		</DialogContent>
		<DialogActions>
		<Button onClick={handleClose} color="primary">
			Close
		</Button>
		</DialogActions>
	</Dialog>
	</div>
  );
}
