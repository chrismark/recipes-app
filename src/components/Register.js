import { Form, Row, Col, Button } from 'react-bootstrap'

const Register = () => {
  return (
    <Form>
      <h2>Register</h2>
      <Row className='mb-3'>
        <Form.Group as={Col} controlId='formGridEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Enter email' />
        </Form.Group>

        <Form.Group as={Col} controlId='formGridPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' />
        </Form.Group>
      </Row>

      <Row className='mb-3'>
        <Form.Group as={Col} controlId='formGridFirstname'>
          <Form.Label>Firstname</Form.Label>
          <Form.Control placeholder='Firstname' />
        </Form.Group>

        <Form.Group as={Col} controlId='formGridLastname'>
          <Form.Label>Lastname</Form.Label>
          <Form.Control placeholder='Lastname' />
        </Form.Group>
      </Row>

      <Button variant='primary' type='submit'>Submit</Button>
    </Form>
  )
}

export default Register