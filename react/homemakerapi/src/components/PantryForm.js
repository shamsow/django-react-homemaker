import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';


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

	const [formData, updateFormData] = useState(initialFormData);
	const [units, updateUnits] = useState(initialUnits);

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
				console.log(error.response.data.detail);
				
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
				console.log(error.response.data.detail);
				
			});

	};
  
	return (
	  <div className={classes.root}>
		<div>
		<form noValidate>
		  <TextField
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
		  />
		  <TextField
			select
			label="Unit"
			className={classes.textField}
			defaultValue={props["item-unit"] ? props["item-unit"] : ""}
			value={formData["unit"]}
			onChange={handleChange}
			helperText="Limited to certain units"
			margin="dense"
			name="unit"
			// disabled={props["item-unit"]? true: false}
			>
			{units.map((unit) => (
				<MenuItem key={unit} value={unit}>
				{unit}
				</MenuItem>
			))}
			</TextField>
			<TextField
				label="Amount"
				id="outlined-margin-dense"
				defaultValue={props["item-amount"] ? props["item-amount"] : ""}
				className={classes.textField}
				helperText="Must be to two decimal places"
				margin="dense"
				name="amount"
				onChange={handleChange}
			/>
		  <Button
			type="submit"
			fullWidth
			variant="contained"
			color="primary"
			onClick={props["item-name"]? handleUpdate: handleCreate}
			>
				Submit
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
      <Button color="primary" onClick={handleClickOpen}>
        {props.title}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create/Update Ingredient</DialogTitle>
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
