import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Control, Col, Row, Alert, Button, Spinner, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  message: Yup.string().required(),
});

const Comment = ({ data }) => {
  const [replies, setReplies] = useState([]);

  const onReply = (e) => {
    e.preventDefault();
  };

  const onViewReply = (e) => {
    e.preventDefault();
  };

  return (
  <>
    <Card>
      <Card.Header className='text-muted'>
        <Row>
          <Col md={6}>
            {data.name}
            <Link to='#' onClick={onReply} className='text-decoration-none ms-3'>Reply</Link>
          </Col>
          <Col className='text-end'>
            {new Date(data.posted_on).toLocaleString('en-US', {timezone: user.timezone })}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {data.message}
      </Card.Body>
    </Card>
    <div className='text-start text-muted'>
      <Link to='#' onClick={onViewReply} className='text-decoration-none'>Replies ({data.replies_count})</Link>
    </div>
    <Row>
      {replies.length > 0 && replies.map(reply => (
        <Col>
          <Comment data={reply} />
        </Col>
      ))}
    </Row>
  </>
  );
};

const RecipeComments = ({ user, recipe }) => {
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getComments();
  }, [page]);

  const getComments = async () => {
    const [comments, error] = await fetchComments(user.token, recipe.id, page);
    setComments(comments);
  };

  const fetchComments = async (token, recipe_id, page) => {
    const url = `/api/recipes/${recipe_id}/comments`;
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await result.json();
    console.log('result: ', result);
    console.log('data: ', data);
    if (data.errorMessage) {
      return [null, data.errorMessage];
    }
    return [data, null];
  };

  const doSubmit = async (values) => {
    console.log('values: ', values);
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);

    const url = `/api/recipes/${recipe.id}/comments`;
    const result = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ parent_id: values.parent_id, message: values.message })
    });
    const data = result.json();
    console.log('result: ', result);
    console.log('data: ', data);

    setSubmitting(false);
    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
      setShowSubmitError(true);
    }
  };

  return (
  <Row xs={1} className='gy-3'>
    <Col>
      <Formik
        validationSchema={schema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={doSubmit}
        initialValues={{
          comment: '',
          parent_id: -1,
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
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <h2>Comments</h2>
            <Alert show={showSubmitError} variant='danger'>
              {(submitError ? submitError : '')}
            </Alert>
            <Form.Control
              type='hidden'
              name='parent_id'
              value={values.parent_id}
              />
            <Form.Group className='mb-3' controlId='validationFormik1'>
              <Form.Control
                disabled={isSubmitting}
                as='textarea'
                name='message'
                value={values.message}
                placeholder={`What do you think about ${recipe.name}?`}
                onChange={handleChange}
                rows={5}
                />
            </Form.Group>
            <div className='text-right'>
            {!isSubmitting ? 
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
            </div>
          </Form>
        )}
      </Formik>
    </Col>
    {comments.length > 0 && comments.map(comment => (
    <Col>
        <Comment data={comment} />
    </Col>
    ))}
  </Row>
  );
};

export default RecipeComments;