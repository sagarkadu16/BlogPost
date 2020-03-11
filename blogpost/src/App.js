import React, { Component } from 'react'
import {BrowserRouter} from "react-router-dom"
import Routes from './Routes/Routes'
import Navbar from './Components/Navbar'
import { connect } from 'react-redux'
import { loginStatus } from './Redux/actions'


class App extends Component{

  componentWillMount(){
    const loginData = JSON.parse(localStorage.getItem('userDetail'))
    let loginStatus = loginData.loggedIn
    console.log('login status on app.js',loginStatus)
    this.props.checkInitialStatus(loginStatus)
  }


  render(){
    return (
      <BrowserRouter>
        <Navbar {...this.props}/>
        <Routes />
      </BrowserRouter>
    )
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    checkInitialStatus : (inp) => dispatch(loginStatus(inp))
  }
}

export default connect(null,mapDispatchToProps)(App)