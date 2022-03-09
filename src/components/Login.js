import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const Login = ({ onLogin, onPostLogin }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const doSubmit = async (values) => {
    console.log('values: ', values);
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);
    const payload = { email: values.email, password: values.password };
    const [data, error] = await onLogin(payload);
    console.log('doSubmit: data=', data, ', error=', error);
    if (data) {
      onPostLogin(data);
    }
    else {
      setSubmitting(false);
      setSubmitError(error);
      setShowSubmitError(true);
    }
    
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={doSubmit}
      initialValues={{
        email: '',
        password: '',
      }}
      >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Alert show={showSubmitError} variant='danger'>
            {(submitError ? submitError : '')}
          </Alert>
          <Form.Group className='mb-3' controlId='validationFormik1'>
            <Form.Label>Email</Form.Label>
            <Form.Control 
              disabled={submitting} 
              type='text' 
              name='email'
              value={values.email}
              placeholder='Enter email' 
              onChange={handleChange} 
              isValid={touched.email && !errors.email}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3' controlId='validationFormik02'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
              disabled={submitting} 
              required 
              type='text'
              name='password' 
              placeholder='Password' 
              onChange={handleChange} 
              isValid={touched.password && !errors.password}
              isInvalid={!!errors.password}
            />
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
      )}
    </Formik>
  );
};

export default Login;