import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import {login} from '../Redux/actions'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email:'',
            password:'',
            helpText:'',
            token:'',
            isLoggedIn : false
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = e =>{
        e.preventDefault()  
        let user = {
            email:this.state.email,
            password:this.state.password
        }

        // axios call to register new user
        axios.post('http://127.0.0.1:5000/auth/login',user)
            // .then(res => console.log(res))
            .then(res => this.setState({
                helpText:res.data.message,
                token:res.data.token,
                isLoggedIn:res.data.loggedIn
            }))
            .then(res =>
                this.state.isLoggedIn ? localStorage.setItem('userDetail',JSON.stringify({
                    'token':this.state.token,
                    loggedIn:true
                })) : localStorage.setItem('userDetail',JSON.stringify({
                    'token':'',
                    loggedIn:false  
                }))
                )
                .then(res =>
                        axios.get('http://127.0.0.1:5000/auth/getuserdata',{
                            headers:{
                                Authorization:`Bearer ${this.state.token}` 
                            }
                        })
                        .then(res => this.props.login(res.data.detail[0]))
                        .catch(err => console.log(err))
                    )
                
            .catch(err => console.log(err))
    }


    render(){
        if(this.props.isLoggedIn){
            return <Redirect to='/dashboard' />
        }else{
            return (

                <div className="card">
                <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" className="card-img" alt="backgroundImage" />
                <div className="card-img-overlay">
                <div className='container my-5'>
                    <h1 className='text-center text-dark'>Blog Application</h1>
                    <form className='border bg-light shadow-sm w-50 p-3  my-5 mx-auto rounded' onSubmit={this.handleSubmit}>
                        <h5 className='text-center'>Login Page:</h5>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="email" aria-describedby="emailHelp" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="password" />
                        </div>
                       
                        <button type="submit" className="btn btn-primary w-100">Log In</button>
                        {this.state.helpText && <p className='p-2 text-danger'>{this.state.helpText}</p>}
    
                        <div className='my-3'>First Time User ?<Link to='/register'> Register Here</Link></div>
                    </form>
                </div>
                </div>
                </div>



             
            )
        }
    }
}

const mapStateToProps = state =>{
    return {
        detail:state.currentUserDetails,
        isLoggedIn:state.isLoggedIn
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        login:(user) => dispatch(login(user)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)


