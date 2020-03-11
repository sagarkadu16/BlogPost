import React, { Component } from 'react'
import Axios from 'axios'
import Comments from './Comments'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class SpecificBlog extends Component{
    constructor(props){
        super(props)
        this.state = {
            blog : {}
        }
    }

    componentDidMount = () =>{
        let blog = this.props.match.params
        console.log(blog['blog_id'])
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        //request to get all blogs
        Axios.get(`http://127.0.0.1:5000/blog/specificblog/${blog['blog_id']}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
            .then(res => this.setState({
                blog:res.data.blog[0]
            }))
            .catch(err => console.log(err))
    }


    render(){
        // console.log(this.state.blog)
        if(this.props.isLoggedIn){
            return (
                <div key={this.state.blog.id} className='container'>
                    <div>
                        <img src={this.state.blog.url} className='img-fluid' alt='blogimage'></img>
                    </div>
                    <div className='bg-white shadow-sm border border-secondary p-3'>
                        <h4>{this.state.blog.name}</h4>
                        <h5>Category: {this.state.blog.category_name}</h5>
                        <p>{this.state.blog.description}</p>
                        <p className='text-right text-secondary'>- created by {this.state.blog.user_name}</p>
                    </div>
                    <div>
                        <Comments id={this.state.blog.id}  />
                    </div>
                </div>
            )
        }else{
            return <Redirect to='/' />
        }
    }
}


const mapStateToProps = state =>{
    return {
        isLoggedIn:state.isLoggedIn
    }
}

export default connect(mapStateToProps)(SpecificBlog)