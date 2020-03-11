import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            email : '',
            password : '',
            helpText:'',
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = e =>{
        e.preventDefault()  
        let newUser = {
            name:this.state.name,
            email:this.state.email,
            password:this.state.password
        }

        // axios call to register new user
        axios.post('http://127.0.0.1:5000/auth/signup',newUser)
            .then(res => this.setState({
                helpText:res.data.message
            }))
            .catch(err => console.log(err))
            
    }


    render(){
        return (
            <div className='container my-5'>
                <h1 className='text-center'>Blog Application</h1>
                <form className='border shadow-sm w-50 p-3  my-5 mx-auto rounded' onSubmit={this.handleSubmit}>
                    <h5 className='text-center'>Register Page:</h5>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" value={this.state.name} onChange={this.handleChange} className="form-control" id="name" aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address:</label>
                        <input type="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="email" aria-describedby="emailHelp" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="password" />
                    </div>
                   
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    {this.state.helpText && <p className='p-2 text-danger'>{this.state.helpText}</p>}
                    <div className='my-3'>Registration Completed ?<Link to='/'> Login</Link></div>
                </form>
                
            </div>
        )
    }
}
