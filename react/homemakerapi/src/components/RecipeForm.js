import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import IngredientForm from './IngredientForm';


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
	const { recipe, user, refetchData, closeForm } = props;
	// console.log(recipe);
	const classes = useStyles();
	const initialFormData = Object.freeze({
		name: recipe["name"] ? recipe["name"] : '',
		description: recipe["description"] ? recipe["description"] : '',
		instructions: recipe["instructions"] ? recipe["instructions"] : '',
		rating: recipe["rating"] ? recipe["rating"] : null,
		ingredients: recipe["ingredients"] ? recipe["ingredients"] : [],
		user: recipe["user"] ? recipe["user"] : user,
	});

	const initialErrors = Object.freeze({
		name: '',
		description: '',
		instructions: '',
		rating: '',
	});

	const [formData, updateFormData] = useState(initialFormData);
	const [errors, setErrors] = useState(initialErrors)

	const nameRef = useRef(recipe["name"] ? recipe["name"] : '');
	const ratingRef = useRef(recipe["rating"] ? recipe["rating"] : '');
	const descriptionRef = useRef(recipe["description"] ? recipe["description"] : '');
	const instructionsRef = useRef(recipe["instructions"] ? recipe["instructions"] : '');

	// const [message, setMessage] = useState("");

	const updateIngredients = (ingredients) => {
		updateFormData({
			...formData,
			ingredients: ingredients
		});
		console.log(formData);
	}

	const handleUpdate = (e) => {
		e.preventDefault()
		console.log("Updating recipe...");
		let ingredientIDList = formData["ingredients"].map(ingredient => ingredient.id);
		// console.log(ingredientIDList);
		// console.log(formData);
		axiosInstance
			.put(`cookbook/recipe/${recipe["id"]}`, {
				"name": nameRef.current.value,
				"description": descriptionRef.current.value,
				"instructions": instructionsRef.current.value,
				"rating": ratingRef.current.value != ''? ratingRef.current.value : null,
				"user": formData["user"],
				"ingredients": ingredientIDList
			})
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
					name: errorResponse["name"]? errorResponse["name"][0] : '',
					description: errorResponse["description"]? errorResponse["description"][0] : '',
					instructions: errorResponse["instructions"]? errorResponse["instructions"][0] : '',
					rating: errorResponse["rating"]? errorResponse["rating"][0] : '',
				};
				setErrors(newErrors);
			});
	};

	const handleCreate = (e) => {
		e.preventDefault()
		console.log("Creating new recipe...");
		let ingredientIDList = formData["ingredients"].map(ingredient => ingredient.id);
		// console.log(ingredientIDList);
		// console.log(formData);
		axiosInstance
			.post(`cookbook/recipe/create`, {
				"name": nameRef.current.value,
				"description": descriptionRef.current.value,
				"instructions": instructionsRef.current.value,
				"rating": ratingRef.current.value != ''? ratingRef.current.value : null,
				"user": formData["user"],
				"ingredients": ingredientIDList
			})
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
					name: errorResponse["name"]? errorResponse["name"][0] : '',
					description: errorResponse["description"]? errorResponse["description"][0] : '',
					instructions: errorResponse["instructions"]? errorResponse["instructions"][0] : '',
					rating: errorResponse["rating"]? errorResponse["rating"][0] : '',
				};
				setErrors(newErrors);
			});
	};
	const handleDelete = (e) => {
		e.preventDefault()
		// console.log(ratingRef.current.value)
		console.log("Deleting recipe...");
		axiosInstance
			.delete(`cookbook/recipe/${recipe["id"]}`)
			.then((res) => {
				console.log("Succesfully deleted!");
				refetchData();
				closeForm();
			})
			.catch((error) => {
				console.log("Encountered an error.")
				console.log(error.response.data.detail);
			});
	};

	return (
	  <div className={classes.root}>
		<div>
		<form noValidate>
			<TextField
				required
				inputRef={nameRef}
				id="outlined-full-width"
				label="Name"
				style={{ margin: 8 }}
				// fullWidth
				defaultValue={recipe["name"] ? recipe["name"] : ""}
				margin="normal"
				name="name"
				error={errors["name"].length? true : false}
				helperText={errors["name"].length? errors["name"] : "Name of the recipe (Ex: Grandma's Egg Friend Rice)"}
				// helperText="Name of the recipe (Ex: Grandma's Egg Friend Rice)"
				InputLabelProps={{
				shrink: true,
				}}

			/>
			<TextField
				inputRef={ratingRef}
				id="outlined-full-width"
				type='number'
				label="Rating"
				style={{ margin: 8 }}
				defaultValue={recipe["rating"] ? recipe["rating"] : ""}
				margin="normal"
				name="rating"
				error={errors["rating"].length? true : false}
				helperText={errors["rating"].length? errors["rating"] : "Optional (1 - 10)"}
			/>
			<TextField
				required
				multiline
				fullWidth
				inputRef={descriptionRef}
				style={{ margin: 8 }}
				label="Description"
				name="description"
				defaultValue={recipe["description"] ? recipe["description"] : ""}
				margin="normal"
				error={errors["description"].length? true : false}
				helperText={errors["description"].length? errors["description"] : "Short description of the dish"}
			/>
			<TextField
				required
				fullWidth
				multiline
				inputRef={instructionsRef}
				style={{ margin: 8 }}
				label="Instructions"
				defaultValue={recipe["instructions"] ? recipe["instructions"] : ""}
				margin="normal"
				name="instructions"
				error={errors["instructions"].length? true : false}
				helperText={errors["instructions"].length? errors["instructions"] : "Succinct instructions on how to make the recipe."}
			>
			</TextField>
			<IngredientForm 
				ingredients={recipe["ingredients"] ? recipe["ingredients"] : {}}
				updateIngredients={updateIngredients}
			/>
			{recipe["name"] && <Button
				type="submit"
				// fullWidth
				style={{ margin: 8 }}

				variant="contained"
				color="alert"
				onClick={handleDelete}
				margin={4}
				>
					Delete
			</Button>
			}
			<Button
				type="submit"
				// fullWidth
				style={{ margin: 8 }}

				variant="contained"
				color="primary"
				onClick={recipe["name"]? handleUpdate: handleCreate}
				>
				{recipe["name"]? "Update": "Create"}
			</Button>
		  </form>
		</div>
	  </div>
	);
  }


export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
//   console.log(props);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
	<div>
	<Tooltip title={props["recipe"]["name"]? "Edit Recipe": "Create Recipe"}>
		<IconButton color="primary" onClick={handleClickOpen}>
			{props.title}
		</IconButton>
	</Tooltip>
	<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<DialogTitle id="form-dialog-title">{props["recipe"]["name"]? "Update ": "Create "}Recipe</DialogTitle>
		<DialogContent>
		{/* <DialogContentText>
			
		</DialogContentText> */}
		<LayoutTextFields
			recipe={props["recipe"]}
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
