import React from 'react';
import ReactRouter from 'react-router';
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const hashHistory = ReactRouter.hashHistory;
const IndexRoute = ReactRouter.IndexRoute;

const routes = (
  <Router history={hashHistory}>
    <Route path='/' />
  </Router>
)

module.exports= routes;
