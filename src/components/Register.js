import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import MainContainer from './MainContainer';

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
});

const Register = ({ onRegister, onPostRegister }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const doSubmit = async (values) => {
    console.log('values: ', values);
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);
    const payload = { 
      email: values.email, 
      password: values.password,
      firstname: values.firstname,
      lastname: values.lastname,
    };
    const [data, error] = await onRegister(payload);
    console.log('doSubmit: data=', data, ', error=', error);
    if (data) {
      onPostRegister(data);
    }
    else {
      setSubmitting(false);
      setSubmitError(error);
      setShowSubmitError(true);
    }
    
  };

  return (
    <MainContainer>
      <Container>
        <Row className='justify-content-md-center'>
          <Col md='7'>
            <Formik
              validationSchema={schema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={doSubmit}
              initialValues={{
                email: '',
                password: '',
                firstname: '',
                lastname: '',
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
                  <h2>Register</h2>
                  <Alert show={showSubmitError} variant='danger'>
                    {(submitError ? submitError : '')}
                  </Alert>
                  <Row className='mb-3'>
                    <Form.Group as={Col} controlId='formGridEmail'>
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
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridPassword'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        disabled={submitting} 
                        type='password'
                        name='password' 
                        placeholder='Password'
                        onChange={handleChange}
                        isValid={touched.password && !errors.password}
                        isInvalid={!!errors.password} 
                      />
                    </Form.Group>
                  </Row>
                  <Row className='mb-3'>
                    <Form.Group as={Col} controlId='formGridFirstname'>
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        disabled={submitting} 
                        type='text'
                        name='firstname'
                        value={values.firstname}
                        placeholder='Firstname'
                        onChange={handleChange}
                        isValid={touched.firstname && !errors.firstname}
                        isInvalid={!!errors.firstname}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId='formGridLastname'>
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control 
                        disabled={submitting}
                        type='text'
                        name='lastname'
                        placeholder='Lastname' 
                        onChange={handleChange}
                        isValid={touched.lastname && !errors.lastname}
                        isInvalid={!!errors.lastname}
                      />
                    </Form.Group>
                  </Row>
                  {!submitting ?
                    (<Button variant='primary' type='submit'>Submit</Button>)
                    :
                    (
                      <Button variant='primary' type='submit' disabled>
                        <Spinner
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          aria-hidden='true'
                        />
                        {' '}Processing...
                      </Button>
                    )
                  }
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </MainContainer>
  );
};

export default Register;