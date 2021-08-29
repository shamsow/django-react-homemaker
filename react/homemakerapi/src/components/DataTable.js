import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// // Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

// var rows = [
//   createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
//   createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
//   createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
// ];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
	paddingTop: theme.spacing(4),
	marginTop: theme.spacing(10),
	margin: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function DataTable(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  // console.log(props);

  // props.address => api endpoint 	 	String
  // props.title => data identity  	 	String
  // props.headings => table headers 	Array
  // props.fields => table cell fields 	Array

  useEffect(() => {
    axiosInstance.get(props.address)
      .then((response) => {
      // console.log(response.data);
      // console.log("Made a request for ingredients");
      setData(response.data);
    })
      .catch((error) => console.log(error));
  }, []);

  return (
    <React.Fragment>
	<Paper className={classes.paper}>
      <Title>{props.title}</Title>
      <Table size="small">
        <TableHead>
			<TableRow>
				{props.headings.map((name) => (
					<TableCell>{name}</TableCell>
					// <TableCell>Payment Method</TableCell>
					//<TableCell align="right">Sale Amount</TableCell>
				))}
			</TableRow>

        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {props.fields.map((field_name) => (
                <TableCell>{row[field_name]}</TableCell>
              ))}
                <TableCell>{new Date(row.modified).toLocaleDateString()}</TableCell>
                    {/* <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.unit}</TableCell> */}
                    {/* <TableCell>{row.paymentMethod}</TableCell> */}
                    {/* <TableCell align="right">{row.amount}</TableCell> */}
            </TableRow>
          ))}

        </TableBody>
      </Table>
      {/* <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more ingredients
        </Link>
        
      </div> */}
	  </Paper>
    </React.Fragment>
  );
}
