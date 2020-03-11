import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'

class MyBlogs extends Component {
        constructor(props){
            super(props)
            this.state = {
                blog : []
            }
        }

        componentDidMount(){
            let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            //get current user data
            Axios.get('http://127.0.0.1:5000/blog/userblogs',{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
                // .then(res => console.log(res.data.blogs))
                .then(res => this.setState({
                    blog:res.data.blogs
                }))
                .catch(err => console.log(err))

        }

        blogDelete = id =>{
            let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            //get current user data
            Axios.delete(`http://127.0.0.1:5000/blog/delete/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}` 
                }
            })
                .then(res =>
                        Axios.get(`http://127.0.0.1:5000/blog/userblogs`,{
                            headers:{
                                Authorization:`Bearer ${token}` 
                            }
                        })
                        .then(res => this.setState({
                            blog:res.data.blogs
                        }))
                    )
                .catch(err => console.log(err))
        }

        handleBlogEdit = id =>{
            this.props.history.push(`/blog/editblog/${id}`)
        }

        handleBlogView = id =>{
            this.props.history.push(`/blog/${id}`)
        }

        render(){
                console.log(this.state.blog)
                if(this.props.isLoggedIn){
                    return (
                        <div className='d-flex flex-column container'>
                            {this.state.blog.length ?
                              this.state.blog.map(blog =>
                                <div key={blog.id} className='border border-secondary shadow-sm my-2 rounded row'>
                                    <div className='col-md-4 p-2 col-12'>
                                        <img className='img-fluid' src={blog.url} alt='blogimages'></img>
                                    </div>
                                    <div className='col-md-8 col-12 p-3'>
                                        <h3>{blog.name}</h3>
                                        <h5>Category: {blog.category_name}</h5>
                                        <p>{blog.description.substring(0,100)}...</p>
                                        <p>written by: {blog.user_name}</p>
                                        <button className='btn btn-primary m-2' onClick={() => this.handleBlogEdit(blog.id)}>Edit</button>
                                        <button className='btn btn-info m-2' onClick={() => this.handleBlogView(blog.id)}>View</button>
                                        <button className='btn btn-danger m-2' onClick={() => this.blogDelete(blog.id)}>Delete</button>
                                    </div>
                                </div>
                            
                       ): <h1 className='text-center mt-5'>You don't have any blogs written...</h1>
                     }
                        </div>
                     )
                }else{
                    return <Redirect to='/' />
                }
        }
}

const mapStateToProps = state =>{
    return {
        user:state.currentUserDetails,
        isLoggedIn:state.isLoggedIn
    }
}

export default connect(mapStateToProps)(MyBlogs)
