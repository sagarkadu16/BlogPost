import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Logout extends Component {
    constructor(props){
        super(props)
        this.state ={
            count:5
        }
    }

    componentDidMount(){
        this.x = setTimeout(() => {
            this.props.history.push('/')
        }, 5000);

        this.y = setInterval(() => {
            this.changeState()
        }, 1000);
    }

    changeState = () =>{
        this.setState({
            count: this.state.count-1
        })
    }

    componentWillUnmount(){
        clearInterval(this.x)
        clearInterval(this.y)
    }
    render(){
        return (
            <div className='text-center text-success'>
                <h1>You are successfully logged out...</h1>
                <h4>wait we are redirecting you to login in <span className='text-danger'>{this.state.count}</span></h4>

                <Link to='/'>Login Page</Link>
            </div>
        )
    }
}
