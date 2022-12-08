import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingAddressScreen() {
  const navigate = useNavigate();
  const {state, dispatch: ctxDispatch} = useContext(Store)
  const { userInfo } = state;
  const { cart: { shippingAddress } } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  

  useEffect(()=>{
    if(userInfo == null) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    ctxDispatch({type: 'SET_SHIPPING_ADDRESS', payload: {fullName, address, city, postalCode, country}});
    navigate('/payment');
  }

  return (
    <div>
      <Helmet>
        <title>Shipping address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
      <h1 className="mb-3">Shipping address</h1>
      <Form onSubmit={submitHandler} >
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control onChange={(e)=>setFullName(e.target.value)} value={fullName} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control onChange={(e)=>setAddress(e.target.value)} value={address} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control onChange={(e)=>setCity(e.target.value)} value={city} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control onChange={(e)=>setPostalCode(e.target.value)} value={postalCode} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control onChange={(e)=>setCountry(e.target.value)} value={country} />
        </Form.Group>
        <div className="mt-3">
          <Button type="submit">Continue</Button>
        </div>
      </Form>
      </div>
    </div>
  )
}

export default ShippingAddressScreen