import React, { Component } from 'react'
import Axios from 'axios'

export default class ShowAllBlogs extends Component {
    constructor(props){
        super(props)
        this.state = {
            blog_data:[]
        }
    }

    componentDidMount(){
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        //request to get all blogs
        Axios.get('http://127.0.0.1:5000/blog/',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
            .then(res => this.setState({
                blog_data:res.data.blogs
            }))
            .catch(err => console.log(err))
    }

    handleBlogNavigate = blog_id =>{
        this.props.history.push(`/blog/${blog_id}`)
    }

    render(){
        return (
           <div className='d-flex flex-column'>
               { this.state.blog_data.map(blog =>
                        <div key={blog.id} className='border border-secondary shadow-sm my-2 rounded row'>
                            <div className='col-md-4 p-2 col-12'>
                                <img className='img-fluid' src={blog.url} alt='blogimages'></img>
                            </div>
                            <div className='col-md-8 col-12 p-3'>
                                <h3>{blog.name}</h3>
                                <h5>Category: {blog.category_name}</h5>
                                <p>{blog.description.substring(0,100)}...</p>
                                <p>written by: {blog.user_name}</p>
                                <button className='btn btn-primary' onClick={() => this.handleBlogNavigate(blog.id)}>See More</button>
                            </div>
                        </div>
               )}
           </div>
        )
    }
}


