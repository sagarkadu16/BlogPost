import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class EditBlog extends Component {
    constructor(props){
        super(props)
        this.state = {
            category_data:[],
            id:'',
            title:'',
            url:'',
            desc:'',
            category:'Action',
            helpText:''
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    handleSubmit = e =>{
        e.preventDefault()
    }

    handleBlogEdit = () =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let updatedBlog = {
            blog_id : this.state.id,
            name : this.state.title,
            url : this.state.url,
            description : this.state.desc,
            category_name:this.state.category
        }


        Axios.put(`http://127.0.0.1:5000/blog/update`,updatedBlog,{
            headers:{
                Authorization:`Bearer ${token}` 
            }
        }).then(res =>this.setState({
            helpText:res.data.message
        }))

    }

    componentDidMount(){
        let blog_id = this.props.match.params.id
        console.log(blog_id)
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        //prepopulate specific blog data
        Axios.get(`http://127.0.0.1:5000/blog/specificblog/${blog_id}`,{
            headers:{
                Authorization:`Bearer ${token}` 
            }
        })
        // .then(res => console.log(res.data.blog))
        .then(res => this.setState({
            id:blog_id,
            title:res.data.blog[0].name,
            url:res.data.blog[0].url,
            desc:res.data.blog[0].description,
            category:res.data.blog[0].category_name
        }))
        .then(res =>
                //request to get all categories
                Axios.get('http://127.0.0.1:5000/blog/categories',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                // .then(res => console.log(res.data.categories))
                .then(res => this.setState({
                    category_data : res.data.categories
                }))
            )
        .catch(err => console.log(err))
    }

    render() {
       if(this.props.isLoggedIn){
        return (
            <div className='container w-75 p-5 rounded border bg-white shadow-sm'>
                <h4 className='my-3 w-50 mx-auto'>Write An Amazing Blog !!!</h4>
                <form className='my-1 w-50 mx-auto' onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" value={this.state.title} onChange={this.handleChange} className="form-control" id="title" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image Url:</label>
                        <input type="text" value={this.state.url} onChange={this.handleChange} className="form-control" id="url" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select className="form-control" value={this.state.category} onChange={this.handleChange} id="category">
                        {this.state.category_data.map(category => 
                                <option key={category.id} value={category.category_name}>{category.category_name}</option>
                            )}
                        </select>    
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Blog Content:</label>
                        <textarea className="form-control" value={this.state.desc} onChange={this.handleChange} id="desc" rows="5"></textarea>
                    </div>
                    <button className='btn btn-outline-primary' onClick={() => this.handleBlogEdit()}>Edit</button>
                </form>
                <div className='my-2 w-50 mx-auto'>{this.state.helpText && <h5 className='text-success'>{this.state.helpText}</h5>}</div>
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

export default connect(mapStateToProps)(EditBlog)