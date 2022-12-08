import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

function PaymentMethodScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { paymentMethod, shippingAddress } } = state;
  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');
  const navigate = useNavigate();
  useEffect(() => {
    if(!shippingAddress.address){
      navigate('/shipping');
    }
  }, [navigate, shippingAddress])
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({type: 'SET_PAYMENT_METHOD', payload: paymentMethodName});
    navigate('/placeorder')
  }
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <div className="container small-container">
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler} > 
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e)=>setPaymentMethodName(e.target.value)}
            />
          </div>  
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e)=>setPaymentMethodName(e.target.value)}
            />
          </div>  
          <Button type="submit"> Continue</Button>
        </Form>
      </div>
    </div>
  )
}

export default PaymentMethodScreen