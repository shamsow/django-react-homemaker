import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
// import Divider from '@material-ui/core/Divider';
import RecipeCard from './RecipeCard';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import MealForm from './MealForm';


const useRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  appBarSeparator: {
    marginTop: theme.spacing(10),
    margin: theme.spacing(1),
  },
  container: {
    overflowY: 'scroll',
    height: '85vh',
  },
  title: {
    flex: '1 1 100%',
    marginLeft: theme.spacing(90), // !!! TODO : FIX THIS GARBAGE
  },
}));

function RecipeDialog(props) {
  const { recipe } = props;
  // console.log(recipe);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Chip label={recipe.name} variant="outlined" onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'md'}
        fullWidth={true}
        scroll='paper'
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          <Typography variant='h3' gutterBottom>{recipe.name}</Typography>
          </DialogTitle> */}
        <DialogContent>
          <RecipeCard recipe={recipe} makeExpanded={true}></RecipeCard>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row(props) {
  const { row, refetchData } = props;
  // console.log(row);
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          <Typography variant="button" gutterBottom component="div">
            {row.date}
          </Typography>
        </TableCell>
        <TableCell align="center">{new Date(row.created).toUTCString()}</TableCell>
        <TableCell align="center">{new Date(row.modified).toUTCString()}</TableCell>
        <TableCell align="center">{Object.keys(row.meals).length}</TableCell>
        <TableCell align="center">
          <MealForm 
            title={<AddIcon/>}
            meal={{date: row.date}}
            user={row.user}
            refetchData={refetchData}
            mealID={row.id}
          >
          </MealForm>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Meals
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Meal Type</TableCell>
                    <TableCell>Recipe Name</TableCell>
                    <TableCell align="center">Created</TableCell>
                    <TableCell align="center">Modified</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.meals.map((mealRow) => (
                    <TableRow key={mealRow.date}>
                      <TableCell component="th" scope="row">
                        {mealRow.meal_type}
                      </TableCell>
                      <TableCell><RecipeDialog recipe={mealRow.recipe}/></TableCell>
                      <TableCell align="center">{new Date(mealRow.created).toUTCString()}</TableCell>
                      <TableCell align="center">
                        {new Date(mealRow.modified).toUTCString()}
                      </TableCell>
                      <TableCell align="center">
                        <MealForm 
                        title={<EditIcon/>} 
                        meal={mealRow}
                        user={mealRow.user}
                        refetchData={refetchData}
                        >
                        </MealForm>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const classes = useRowStyles();
  const [data, setData] = useState([]);
  const [refetchSwitch, triggerSwitch] = useState(false);

  useEffect(() => {
    axiosInstance.get(`mealplan/all`)
      .then((response) => {
        setData(response.data);
        // console.log(data)
      })
      .catch((error) => console.log(error));
  }, [refetchSwitch])
  
  const refetchData = () => {
    console.log("Refetching data");
    triggerSwitch(!refetchSwitch);
  };

  return (
    <TableContainer component={Paper} className={`${classes.appBarSeparator} ${classes.container}`}>
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" gutterBottom>
            Meal Plans
        </Typography>
        <MealForm
          title={<AddIcon/>}
          meal={{}}
          user={data[0] ? data[0]["user"] : ""}
          refetchData={refetchData}
          >
        </MealForm>
      </Toolbar>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Modified</TableCell>
            <TableCell align="center">Meal Count</TableCell>
            <TableCell align="center">
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.id} row={row} refetchData={refetchData}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}