import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import App from './App';
// import Dashboard from './components/Dashboard';
import Nav from './components/Nav';
import Connection from './components/Api';
import Pantry from './components/Pantry';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Cookbook from './components/Cookbook';
import MealPlan from './components/MealPlan';
// import { FormatListBulletedTwoTone } from '@material-ui/icons';

// import Header from './components/Header';
// import Footer from './components/Footer';
// import reportWebVitals from './reportWebVitals';

function isAuthed() {
  if(localStorage.getItem('access_token')) {
    return true;
  }
  return false;
}

// function isAuthed() {
//   return true;
// }

// var checkAuth = {
//   isAuthed: isAuthed() ? true : false
// }

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthed() === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const routing = (
  <Router>
    <React.StrictMode>
      {/* <Header /> */}
      <div style={{display: 'flex'}}>
      <Nav isAuthed={isAuthed()}/>
      <Switch>

        <PrivateRoute exact path="/" component={App} />
        <PrivateRoute exact path="/pantry" component={Pantry} />
        <PrivateRoute exact path="/cookbook" component={Cookbook} />
        <PrivateRoute exact path="/mealplan" component={MealPlan} />
        <PrivateRoute exact path="/logout" component={SignOut} />

        <Route exact path="/api" component={Connection} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/login" component={SignIn} />
        
        {/* <Route exact path="/navtest" component={Nav} /> */}
      </Switch>
      </div>
      {/* <Footer /> */}
    </React.StrictMode>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
