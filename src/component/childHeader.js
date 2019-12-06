import React, { Component } from 'react';
import { connect } from 'react-redux'
import '../css/child-header.scss'
import { withRouter } from 'react-router-dom'
class childHeader extends Component{
    constructor(props){
        super(props)
        this.toBack = this.toBack.bind(this)
    }
    render(){
     return(
       <header className={this.props.headerOptions.status === 0 ? 'child-header text-overflow' : 'child-header text-overflow white'}>
          <h3 className="text-overflow">{this.props.headerOptions.headerTitle}</h3>
          <span onClick={this.toBack}>&#xe649;</span>
       </header>
     )
    }
    toBack(){
      this.props.history.goBack()
    }
}
const mapStateToProps = state => ({
  headerOptions: state.headerOptions
})
export default  connect(
    mapStateToProps
  )(withRouter(childHeader))