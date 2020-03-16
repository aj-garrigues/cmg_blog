import React, { Component } from 'react';
import {Button, Container, Row, FormGroup, Input, Col} from 'reactstrap'
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css';
// import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      post: '',
      posts: []
    }
  }

  componentDidMount()  {
    console.log('component has mounted')

    const that = this
    fetch('http://localhost:3000/api/posts')
    .then( function(res) {
      res.json()
      .then( function(data){
        // console.log(data)
        that.setState({
          posts: data
        })
      })
    })
  }

  handleChange = (e) => {
      this.setState({
          [e.target.name]: e.target.value
      })
  }

  addPost(e) {
    var that = this
    const {post} = this.state
    e.preventDefault()
    // console.log('insert post')

    let data  = {
      post
    }

    // console.log(this.refs)

    var req = new Request('http://localhost:3000/api/add-post', {
      method: 'POST',
      headers: new Headers({  
        'Content-Type': 'application/json',
        // 'Accept': 'application/json' 
      }),
      body: JSON.stringify(data)
    })

    //httprequest()

    let posts  = that.state.posts
    posts.push(data)
    that.setState({
      posts: posts
    })

    fetch(req)
      .then( function(res){
        res.json()
        .then( function(data){
          console.log(data)
        })
      })
      .catch(function(err){
        console.log(err)
      })

    /** 
    fetch(req).then(res => {
      console.log(res);
      return res.json();
    }).then(data => {
      // Work with JSON data here
      console.log(data);
    }).catch(err => {
      // Do something for an error here
      console.log("Error Reading data " + err);
    });

    */
    
  }

  removePost(id)  {
    // console.log(this)
    let that =  this
    let {posts}  = this.state
    let post = posts.find( function(post) {
      return post.id === id
    })

    console.log(post)

    var req = new Request('http://localhost:3000/api/remove-post/'+id, {
      method: 'DELETE'    
    })

    fetch(req)
      .then( function(res){

        posts.splice(posts.indexOf(post), 1)
        that.setState({
          posts: posts
        })

        res.json()
        .then( function(data){
          console.log(data)
        })
      })
      .catch(function(err){
        console.log(err)
      })


  }

  render() {

    const { posts } = this.state

    return (
      <div className="App">

        <Container fluid={true}>
          <Row>
            <Col xs="12" md={{ size: 8, offset: 2 }}><h1>RANDOM POST</h1></Col>
          </Row>

          <Row>
            <Col  xs="12" md={{ size: 8, offset: 2 }} >
              <form ref="postFOrm">
              
                <FormGroup>
                  <Input type="textarea" name="post" onChange={e => this.handleChange(e)} value={this.state.post} placeholder="whats on your fookin mind?" />
                </FormGroup>
                {/* <textarea ref="post" placeholder="whats on your fookin mind?"></textarea> */}
                <Button className="float-right" color="primary" onClick={ this.addPost.bind(this) }>POST</Button>
              </form> 
              
            </Col>
          </Row>

          <Row>
            <Col xs="12" md={{ size: 8, offset: 2 }}>
              <br/>
            {posts.map( (post, index) => <div key={index}>
              <em>{moment(post.created_at).format('MMMM Do YYYY, h:mm:ss a')}</em>  <Button className="float-right" size="sm" color="danger" onClick={this.removePost.bind(this, post.id)}>x</Button>
              <p > {post.post}  </p>
              <hr/>
            </div>)}
            </Col>  
          </Row>
        </Container>
        {/* <pre>{JSON.stringify(posts)}</pre> */}
      </div>
    );
  }
}

export default App;
