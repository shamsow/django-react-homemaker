import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { Link as RouteLink } from 'react-router-dom';
import Title from './Title';

// date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO'

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axiosInstance.get('pantry/all?ordering=-created')
      .then((response) => {
      setData(response.data.slice(0, 6));
      setLoaded(true);
    })
      .catch((error) => console.log("Encountered an error: " + error));
  }, []);

  return (
    <React.Fragment>
      <Title>Recent Ingredients</Title>
      <Fade in={loaded}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{row.created && formatDistanceToNow(parseISO(row.created), {addSuffix: true})}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Fade>
      <div className={classes.seeMore}>
        <Link color="primary" component={RouteLink} to="/pantry" underline="none">
          See more ingredients
        </Link>
        
      </div>
    </React.Fragment>
  );
}
