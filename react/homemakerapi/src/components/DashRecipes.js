import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { Link as RouteLink } from 'react-router-dom';

// date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO'

// Material UI
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

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
    axiosInstance.get('cookbook/all?ordering=-rating')
      .then((response) => {
      setData(response.data.slice(0, 6));
	  setLoaded(true);
    })
      .catch((error) => console.log("Encountered an error: " + error));
  }, []);

  return (
    <React.Fragment>
      <Title>Top Recipes</Title>
	  <Fade in={loaded}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
				<TableCell>{row.name}</TableCell>
				<TableCell align="right">
				  	<Chip variant="outlined" color="primary" size="small" label={`${row.rating}/10`}/>
				</TableCell>
              <TableCell align="right">{row.created && formatDistanceToNow(parseISO(row.created), {addSuffix: true})}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
	  </Fade>
      <div className={classes.seeMore}>
        <Link color="primary" component={RouteLink} to="/cookbook" underline="none">
          See more recipes
        </Link>
        
      </div>
    </React.Fragment>
  );
}
