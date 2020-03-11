import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../Redux/actions'

function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg border shadow-sm navbar-light" style={{backgroundColor:'#404142'}}>
            <Link className="navbar-brand text-white" to="/dashboard">BlogPost</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
            {props.islogin &&<ul className="navbar-nav ml-auto">
                <li className="nav-item">
                        <Link to={`/blog/${props.user.name}/myblogs`}><button className='btn btn-info btn-sm mx-2'>My Blogs</button></Link>
                </li>
                 <li className="nav-item">
                        <Link to='/writeblog'><button className='btn btn-success btn-sm mx-2'>Write Blog</button></Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/logout'><button className='btn btn-danger btn-sm mx-2' onClick={() => props.logout()}>Logout</button></Link>
                    </li>
                </ul>}
            </div>
        </nav>
    )
}

const mapStateToProps = state =>{
    return {
        islogin:state.isLoggedIn,
        user:state.currentUserDetails
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navbar)

