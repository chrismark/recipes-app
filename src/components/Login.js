import { Form, Button } from 'react-bootstrap'

const Login = () => {
  return (
    <Form>
      <h2>Login</h2>
      <Form.Group className='mb-3' controlId='formGroupEmail'>
        <Form.Label>Email</Form.Label>
        <Form.Control type='email' placeholder='Enter email' />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formGroupPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' placeholder='Password' />
      </Form.Group>
      <Button variant='primary' type='submit'>Submit</Button>
    </Form>
  )
}

export default Login