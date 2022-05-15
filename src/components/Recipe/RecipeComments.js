import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form, Control, Col, Row, Alert, Button, Spinner, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const fetchComments = async (token, recipe_id, comment_id, page) => {
  const url = `/api/recipes/${recipe_id}/comments` + (comment_id ? `/${comment_id}` : '');
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

const submitComment = async (token, recipe_id, comment_id, message) => {
  const url = `/api/recipes/${recipe_id}/comments`;
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ parent_id: comment_id, message: message })
  });
  const data = await result.json();
  console.log('result: ', result);
  console.log('data: ', data);
  return data;
};

const schema = Yup.object().shape({
  message: Yup.string().required(),
});

const CommentForm = ({ title, initialValues, onSubmit, onCancel, placeholder, errorDisplay }) => {
  return (
    <Formik
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        console.log('actions: ', actions);
        actions.setSubmitting(false);
        actions.resetForm(initialValues);
      }}
      initialValues={initialValues}
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
          {title}
          {errorDisplay}
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
              value={values.message || ''}
              placeholder={placeholder}
              onChange={handleChange}
              rows={5}
              />
          </Form.Group>
          <div className='text-right'>
          {!isSubmitting ? 
            (<>
              <Button variant='primary' type='submit'>Submit</Button>{' '}
              {onCancel ? <Button variant='secondary' type='button' onClick={onCancel}>Cancel</Button> : ''}
            </>)
            :
            (<>
              <Button variant='primary' type='submit' disabled>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                {' '}Processing...
              </Button>{' '}
              {onCancel ? <Button variant='secondary' type='button' disabled>Cancel</Button> : ''}
            </>)
          }
          </div>
        </Form>
      )}
    </Formik>
  );
};

CommentForm.defaultProps = {
  placeholder: '',
  errorDisplay: '',
  title: <div className='mt-2'></div>,
};

const Comment = ({ recipe, user, data }) => {
  const repliesRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [replies, setReplies] = useState([]);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const initialValues = {
    comment: '',
    parent_id: data.id
  };

  const doSubmitReply = async (values, actions) => {
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);

    const data = await submitComment(user.token, recipe.id, values.parent_id, values.message);

    setSubmitting(false);
    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
      setShowSubmitError(true);
    }
    else {
      setShowForm(false);
    }
  };

  const onReply = (e) => {
    e.preventDefault();
    setShowForm(true);
  };

  const onCancel = (e) => {
    e.preventDefault();
    setShowForm(false);
  }

  const onViewReplies = async (e) => {
    e.preventDefault();
    const [replies, error] = await fetchComments(user.token, recipe.id, data.id, page);
    setReplies(replies);
    repliesRef.current.scrollIntoView();
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
            <Link to={`#${data.id}`} onClick={onReply} className='text-decoration-none ms-3'>#{data.id}</Link>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {data.message}
      </Card.Body>
    </Card>
    <div className='text-start text-muted ms-3'>
      <Link to='#' onClick={onViewReplies} className='text-decoration-none'>Replies ({data.replies_count})</Link>
    </div>
    <Row ref={repliesRef} xs={1} className='ms-4 gy-3'>
      <Col>
        {showForm && (
        <CommentForm 
          initialValues={initialValues}
          onSubmit={doSubmitReply}
          onCancel={onCancel}
          showSubmitError={showSubmitError}
          errorDisplay={
          <Alert show={showSubmitError} variant='danger'>
            {(submitError ? submitError : '')}
          </Alert>
          }
          />
        )}
      </Col>
      {replies.length > 0 && replies.map(reply => (
        <Col key={reply.id}>
          <Comment recipe={recipe} user={user} data={reply} />
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
  const initialValues = {
    comment: '',
    parent_id: -1
  };

  useEffect(() => {
    getComments();
  }, [page]);

  const getComments = async () => {
    const [comments, error] = await fetchComments(user.token, recipe.id, null, page);
    setComments(comments);
  };

  const doSubmit = async (values, actions) => {
    console.log('values: ', values);
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);

    const data = await submitComment(user.token, recipe.id, values.parent_id, values.message);

    setSubmitting(false);
    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
      setShowSubmitError(true);
    }
    else {
      comments.unshift(data);
      setComments([...comments]);
    }
  };

  return (
  <Row xs={1} className='gy-3'>
    <Col>
      <CommentForm 
        initialValues={initialValues}
        onSubmit={doSubmit}
        showSubmitError={showSubmitError}
        title={<h2>Comments</h2>}
        errorDisplay={
        <Alert show={showSubmitError} variant='danger'>
          {(submitError ? submitError : '')}
        </Alert>
        }
        />
    </Col>
    {comments.length > 0 && comments.map(comment => (
    <Col key={comment.id}>
        <Comment recipe={recipe} user={user} data={comment} />
    </Col>
    ))}
  </Row>
  );
};

export default RecipeComments;