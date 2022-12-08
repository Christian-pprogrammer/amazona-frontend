import { useState, useContext, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';

import { Helmet } from 'react-helmet-async';
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify';
import { getError } from '../utils';

function SignupScreen() {
  const {search} = useLocation();
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect')?params.get('redirect'):'/'
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('passwords do not match');
      return;
    }
    try{
      const {data} = await axios.post('/api/users/signup', {
        name,
        email,
        password
      })
      console.log(data)
      ctxDispatch({type: 'SIGNIN_USER', payload: data})
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/')
    }catch(err) {
      toast.error(getError(err));
    }
  }
  useEffect(()=>{
    if(userInfo) {
      navigate(redirect)
    }
  }, [redirect, userInfo, navigate])
  return (
    <Container className='small-container'>
    <Helmet>
      <title>Sign up</title>
    </Helmet>
      <h1>Sign up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" required onChange={(e)=>setName(e.target.value)} />
      </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className='mb-3' controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onChange={(e)=>setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mb-3' controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" required onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" >Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account? {'  '}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  )
}

export default SignupScreen
