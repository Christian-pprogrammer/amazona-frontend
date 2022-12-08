import Spinner from 'react-bootstrap/Spinner';

function LoadingBox() {
  return (
    <Spinner animation='border' rule='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  );
}

export default LoadingBox;
