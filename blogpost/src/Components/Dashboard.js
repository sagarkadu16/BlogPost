import React, { Component } from 'react'
import { connect } from 'react-redux'
import ShowAllBlogs from './ShowAllBlogs'
import { Redirect } from 'react-router-dom'

class Dashboard extends Component {

    render(){
       if(this.props.isLoggedIn){
        return (
            <div className='container'>
                <h1>Welcome, {this.props.detail.name}</h1>
                <ShowAllBlogs {...this.props} />
            </div>
        )
       }else{
           return <Redirect to='/' />
       }
    }
    
}

const mapStateToProps = state =>{
    return {
        detail:state.currentUserDetails,
        isLoggedIn:state.isLoggedIn
    }
}

export default connect(mapStateToProps)(Dashboard)



