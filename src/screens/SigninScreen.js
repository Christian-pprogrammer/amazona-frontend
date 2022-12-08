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

function SigninScreen() {
  const {search} = useLocation();
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect')?params.get('redirect'):'/'
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post('/api/users/signin', {
        email,
        password
      })
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
      <title>Sign in</title>
    </Helmet>
      <h1>Sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className='mb-3' controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onChange={(e)=>setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" >Sign In</Button>
        </div>
        <div className="mb-3">
          New Customer? {'  '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  )
}

export default SigninScreen
