import React, { useState, useEffect } from 'react';
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
	const classes = useStyles();
	const initialUnits = [
		"mg",
		"g",
		"kg",
		"ml",
		"l",
		"tsp",
		"tblsp",
		"cp",
		"pcs"
	];

	const initialFormData = Object.freeze({
		name: props["item-name"] ? props["item-name"] : '',
		amount: props["item-amount"] ? props["item-amount"] : '',
		unit: props["item-unit"] ? props["item-unit"] : '',
	});

	const initialErrors = Object.freeze({
		name: '',
		unit: '',
		amount: '',
	});


	const [formData, updateFormData] = useState(initialFormData);
	const [units, updateUnits] = useState(initialUnits);
	const [errors, setErrors] = useState(initialErrors)

	useEffect(() => {
		axiosInstance.get("pantry/units")
		  .then((response) => {
		  // console.log(response.data);
		  // console.log("Made a request for ingredients");
		  updateUnits(response.data);
		})
		  .catch((error) => console.log(error));
	  }, []);
	// const [message, setMessage] = useState("");

	const handleChange = (e, field) => {
		// console.log(e);
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleUpdate = (e) => {
		e.preventDefault()
		console.log("Update Pressed...");
		console.log(formData);

		axiosInstance
			.put(`pantry/ingredient/${props["item-id"]}`, {
				"name": formData["name"],
				"amount": formData["amount"],
				"unit": formData["unit"],
				"user": props["user"]
			})
			.then((res) => {
				console.log("Succesfully updated!");
				props.refetchData();
				props.closeForm();
				//console.log(res);
				//console.log(res.data);
			})
			.catch((error) => {
				console.log("Encountered an error.")
				// console.log(error.response.data.detail);
				const errorResponse = error.response.data;
				const newErrors = {
					name: errorResponse["name"]? errorResponse["name"][0] : '',
					unit: errorResponse["unit"]? errorResponse["unit"][0] : '',
					amount: errorResponse["amount"]? errorResponse["amount"][0] : '',
				};
				setErrors(newErrors);
				
			});


	};

	const handleCreate = (e) => {
		e.preventDefault()
		console.log("Creating new ingredient...");
		console.log(formData);

		axiosInstance
			.post(`pantry/ingredient/create`, {
				"name": formData["name"],
				"amount": formData["amount"],
				"unit": formData["unit"],
				"user": props["user"]
			})
			.then((res) => {
				console.log("Succesfully created!");
				props.refetchData();
				props.closeForm();
				//console.log(res);
				//console.log(res.data);
			})
			.catch((error) => {
				console.log("Encountered an error.")
				console.log(error.response.data);
				const errorResponse = error.response.data;
				const newErrors = {
					name: errorResponse["name"]? errorResponse["name"][0] : '',
					unit: errorResponse["unit"]? errorResponse["unit"][0] : '',
					amount: errorResponse["amount"]? errorResponse["amount"][0] : '',
				};
				setErrors(newErrors);
				// console.log(errors);				
			});

	};
  
	return (
	  <div className={classes.root}>
		<div>
		<form noValidate>
		  <TextField
		  	required
			id="outlined-full-width"
			label="Ingredient Name"
			style={{ margin: 8 }}
			defaultValue={props["item-name"] ? props["item-name"] : ""}
			fullWidth
			margin="normal"
			name="name"
			InputLabelProps={{
			  shrink: true,
			}}
			onChange={handleChange}
			error={errors["name"].length? true : false}
			helperText={errors["name"].length? errors["name"] : ''}
		  />
		  <TextField
			select
			required
			label="Unit"
			className={classes.textField}
			defaultValue={props["item-unit"] ? props["item-unit"] : ""}
			value={formData["unit"]}
			onChange={handleChange}
			helperText="Limited to certain units"
			margin="dense"
			name="unit"
			error={errors["name"].length? true : false}
			helperText={errors["name"].length? errors["name"] : ''}
			// disabled={props["item-unit"]? true: false}
			>
			{units.map((unit) => (
				<MenuItem key={unit} value={unit}>
				{unit}
				</MenuItem>
			))}
			</TextField>
			<TextField
				required
				label="Amount"
				id="outlined-margin-dense"
				defaultValue={props["item-amount"] ? props["item-amount"] : ""}
				className={classes.textField}
				helperText="Must be to two decimal places"
				margin="dense"
				name="amount"
				onChange={handleChange}
				error={errors["amount"].length? true : false}
				helperText={errors["amount"].length? errors["amount"] : ''}
			/>
		  <Button
			type="submit"
			fullWidth
			variant="contained"
			color="primary"
			onClick={props["item-name"]? handleUpdate: handleCreate}
			startIcon={<EditIcon/>}
			style={{marginTop: 12}}
			>
				{props["item-name"]? "Update": "Create"}
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
	<Tooltip title={props["item-name"]? "Edit Ingredient": "Create Ingredient"}>
	<IconButton color="primary" onClick={handleClickOpen}>
		{props.title}
	</IconButton>
	</Tooltip>
	<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<DialogTitle id="form-dialog-title">{props["item-name"]? "Update ": "Create "}Ingredient</DialogTitle>
		<DialogContent>
		{/* <DialogContentText>
			
		</DialogContentText> */}
		<LayoutTextFields
			user={props["user"]}
			item-id={props["item-id"]}
			item-name={props["item-name"]}
			item-amount={props["item-amount"]}
			item-unit={props["item-unit"]}
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
