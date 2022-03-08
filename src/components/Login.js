import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

const Login = ({ onLogin, onPostLogin }) => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    const form = e.currentTarget || e.target;
    console.log(form);
    console.log(form.checkValidity && form.checkValidity());
    e.preventDefault();
    e.stopPropagation();
    setValidated(form.checkValidity());
    console.log('validated: ', validated);

    //if (form.checkValidity()) {
      setSubmitting(true);
      const payload = { email, password };
      const data = await onLogin(payload);
      onPostLogin(data);
    //}
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Form.Group className='mb-3' controlId='validationCustom01'>
        <Form.Label>Email</Form.Label>
        <Form.Control disabled={submitting} required type='email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group className='mb-3' controlId='validationCustom02'>
        <Form.Label>Password</Form.Label>
        <Form.Control disabled={submitting} required type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>
      {!submitting ? 
        (<Button variant='primary' type='submit'>Submit</Button>)
        :
        (
          <Button variant='primary' type='submit' disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              />
            {' '}Processing...
          </Button>
        )
      }
      
    </Form>
  );
};

export default Login;