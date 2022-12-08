import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import MessageBox from '../components/MessageBox';
import Card from 'react-bootstrap/Card';

function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock <= 0) {
      window.alert('Product out of stock');
      return;
    }
    ctxDispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity } });
  };

  const removeCartItem = (item)=>{
    ctxDispatch({ type: 'REMOVE_FROM_CART', payload: item._id })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h2>Shopping Cart</h2>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to='/'>Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'
                      />
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button 
                      variant='light' 
                      disabled={item.quantity === 1}
                      onClick={()=>
                        updateCartHandler(item, item.quantity - 1)
                      }>
                        <i className='fas fa-minus-circle' />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant='light'
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className='fas fa-plus-circle' />
                      </Button>
                    </Col>
                    <Col md={3}>$ {item.price}</Col>
                    <Col md={2}>
                      <Button variant='light' onClick={()=>removeCartItem(item)} >
                        <i className='fas fa-trash' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <h3>
                    Subtotal: (
                    {cartItems.reduce(
                      (previousValue, currentValue) =>
                        parseInt(previousValue) +
                        parseInt(currentValue.quantity),
                      0
                    )}{' '}
                    items): $
                    {cartItems.reduce(
                      (prevAmount, currElem) =>
                        prevAmount + currElem.quantity * currElem.price,
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button variant='primary' onClick={checkoutHandler} >Proceed to checkout</Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartScreen;
