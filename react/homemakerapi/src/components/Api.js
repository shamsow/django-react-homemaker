import React from 'react';
import axiosInstance from '../axios';

// Material UI
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormHelperText from '@material-ui/core/FormHelperText';

const MyButton = styled(Button)({
  background: 'linear-gradient(to bottom, #07a8c0, #07adc6, #06b3cd, #06b8d3, #05beda);',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});


class Response extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // console.log(JSON.parse(this.props.data));
  }
  render() {
    return (
      <div>
          <div><pre>{this.props.data}</pre></div>
      </div>
    );
  }
}

class TestAPI extends React.Component {
  // const [data, setData] = useState('');
  constructor(props) {
    super(props);
    this.state = {value: '', data: '', loading: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // console.log('Querying: ' + baseUrl + this.state.value);
    this.setState({loading: true}, () => {
		axiosInstance.get(this.state.value)
      .then((response) => {
        this.setState({
          loading: false,
          data: JSON.stringify(response.data, null, 2)
        });
        console.log(response.data);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          data: "Could not fetch query"
        });
      });
    });
    
    
    event.preventDefault();
  }
  
  render() {
    return (
      <Container className="api-test-container" style={{top: "100px", left: "300px", position: "absolute"}}>
      <form onSubmit={this.handleSubmit} >
        <FormControl>

        <InputLabel htmlFor="my-input">API Path</InputLabel>
        <Input type="text" value={this.state.value} onChange={this.handleChange}></Input>
        <FormHelperText>Case sensitive</FormHelperText>
        {/* <Button variant="contained" color="primary" type="submit">Submit</Button> */}
        <MyButton variant="contained" type="submit">Submit</MyButton>
        </FormControl>

      </form>
      <Paper>
        {this.state.loading ? <LinearProgress /> : <Response data={this.state.data}/>}
      </Paper>
      </Container>
    );
  }
}


export default TestAPI;
