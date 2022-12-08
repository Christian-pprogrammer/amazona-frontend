import Alert from 'react-bootstrap/Alert'

function MessageBox(props) {
  return (
    <Alert variant={props.variant || 'info'}>{props.message ? props.message:props.children}</Alert>
  )
}

export default MessageBox
