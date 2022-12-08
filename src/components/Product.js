import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const navigate = useNavigate();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    navigate('/cart');
  };
  return (
    <Card className='product'>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className='card-img-top' alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          <strong>${product.price}</strong>
        </Card.Text>
        {product.countInStock > 0 ? (
          <Button onClick={() => addToCartHandler(product)}>Add to card</Button>
        ) : (
          <Button disabled variant='light'>
            Out of stock
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
