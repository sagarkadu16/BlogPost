import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'

class Comments extends Component {
    constructor(props){
        super(props)
        this.state = {
            comments : [],
            comment:'',
            helpText:'',
            isCommentEditing:false,
            editComment:'',
            comment_id:''
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]:e.target.value,
            helpText:''
        })
    }



    handlePostComment = () =>{
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        let comment = {
            comment:this.state.comment
        }
        console.log(comment)
            //request to post a comment
            Axios.post(`http://127.0.0.1:5000/blog/${this.props.id}`,comment,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
                .then(res => 
                    Axios.get(`http://127.0.0.1:5000/blog/${this.props.id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }))
                .then(res => this.setState({
                    comments:res.data.comments,
                    helpText:'Comment Pinned',
                    comment:' '
                }))
                .catch(err => console.log(err))
    }


    handleEditClick = comment =>{
        console.log('inside handle edit click')
        this.setState({
            editComment:comment.comment,
            isCommentEditing:true,
            comment_id:comment.id
        })
    }

    handleUpdateClick = () =>{
        console.log('inside handle update click')
        let editComment = {
            comment:this.state.editComment,
            comment_id:this.state.comment_id
        }
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            //request to get all blogs
            Axios.put(`http://127.0.0.1:5000/blog/${this.props.id}`,editComment,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(res => 
                Axios.get(`http://127.0.0.1:5000/blog/${this.props.id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }))
            .then(res => this.setState({
                comments:res.data.comments,
                isCommentEditing:false,
                editComment:''
            }))
            .catch(err => console.log(err))
    }


    handleDeleteClick = comment =>{
        console.log('delete clicked')
        let token = JSON.parse(localStorage.getItem('userDetail'))['token']
        console.log(this.props.id,comment.id)
            //request to get all blogs
            Axios.delete(`http://127.0.0.1:5000/blog/${this.props.id}/${comment.id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(res => 
                Axios.get(`http://127.0.0.1:5000/blog/${this.props.id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }))
            .then(res => this.setState({
                comments:res.data.comments,
            }))
            .catch(err => console.log(err))
    }   





    componentDidMount(){
            let token = JSON.parse(localStorage.getItem('userDetail'))['token']
            //request to get all blogs
            Axios.get(`http://127.0.0.1:5000/blog/${this.props.id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
                .then(res => this.setState({
                    comments:res.data.comments,
                }))
                .catch(err => console.log(err))
    }

    render() {
        // console.log(this.state.comments)  
        return (
            <div className='my-5'>
                <h3>Comments Section</h3>
                <div>
                    <input type='text' className='w-75 py-1' value={this.state.comment} onChange={this.handleChange} id='comment' placeholder='pin your comment...' />
                    <button type='submit' className='btn btn-outline-primary mx-1' onClick={() => this.handlePostComment()}>Post a comment</button>
                    {this.state.helpText && <div className='my-2 py-0 text-success'>{this.state.helpText}</div>}
                </div>
                <div className='my-4'>
                {this.state.comments.map(comment =>
                    <div key={comment.id} className='w-75 border border-dark rounded px-2 m-2 bg-white'>
                        <div className='d-flex flex-wrap justify-content-between'>
                            
                            {(this.state.isCommentEditing && this.state.comment_id === comment.id) ? <input type='text' className='w-75 py-1' value={this.state.editComment} onChange={this.handleChange} id='editComment' placeholder='pin your comment...' /> 
                                :<div>{comment.comment}</div>
                            }
                            {this.props.email === comment.email ? 
                                <div>
                                    {(this.state.isCommentEditing && this.state.comment_id === comment.id) ? <button className='btn btn-sm mt-1 mx-1 btn-outline-primary' onClick={() => this.handleUpdateClick()}>Update</button> 
                                         :<button className='btn btn-sm mt-1 mx-1 btn-outline-primary' onClick={() => this.handleEditClick(comment)}>Edit</button>
                                     }
                                    
                                    <button className='btn btn-sm mt-1 mx-1 btn-outline-danger' onClick={() => this.handleDeleteClick(comment)}>Delete</button>
                                </div>
                                :null
                            }
                        </div>
                        
                         <br/> 
                        <p className='text-right text-secondary'> - By {comment.username}</p>
                    </div>
                )}
                </div>
            </div>
        )
    }
}


const mapStateToProps = state =>{
    return {
        email:state.currentUserDetails.email
    }
}

export default connect(mapStateToProps)(Comments)

