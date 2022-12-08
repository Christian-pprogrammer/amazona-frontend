import { useReducer, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {...state, product: action.payload, loading: false}
    case 'FETCH_ERROR':
      return {...state, loading: false, error: action.payload}
    default:
      return {...state}
  }
}

function ProductScreen() {
  const params = useParams();
  const navigate = useNavigate()
  const [{product, loading, error}, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: ''
  });
  const {slug} = params;
  const {state, dispatch:ctxDispatch} = useContext(Store)
  useEffect(()=>{
    const fetchData = async () => {
      try{
        dispatch({type: 'FETCH_REQUEST'})
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data})
      }catch(err) {
        dispatch({type: 'FETCH_ERROR', payload: getError(err)})
      }
    }
    fetchData();
  }, []);
  const {cart} = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if(data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({type: 'ADD_TO_CART', payload: {...product, quantity}})
    navigate('/cart');
  }
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger' message={error} />
  ) : (
    <div>
      <Helmet>{product.name}</Helmet>
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.title} className='img-large' />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Price: </Col>
                <Col>${product.price}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>

            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col>Price: </Col>
                <Col>${product.price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Status:</Col>
                <Col>
                  {product.countInStock > 0 ? (
                    <Badge bg='success'>In Stock</Badge>
                  ) : (
                    <Badge bg='danger'>Unavailable</Badge>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
            {product.countInStock > 0 && (
              <ListGroup.Item>
                <div className='d-grid'>
                  <Button onClick={addToCartHandler} variant='primary'>Add to Cart</Button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
