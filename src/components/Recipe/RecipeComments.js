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

const submitComment = async (token, recipe_id, id, parent_id, message) => {
  const url = `/api/recipes/${recipe_id}/comments` + (id != -1 ? `/${id}` : '');
  const result = await fetch(url, {
    method: id != -1 ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(id != -1 ? { id, message } : { parent_id, message })
  });
  const data = await result.json();
  console.log('result: ', result);
  console.log('data: ', data);
  return data;
};

const schema = Yup.object().shape({
  message: Yup.string().required(),
});

const CommentForm = ({ title, initialValues, onSubmit, onCancel, placeholder, errorDisplay, submitButtonText, submitButtonVariant }) => {
  console.log('re-render CommentForm');
  return (
    <Formik
      enableReinitialize={true}
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
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
            name='id'
            value={values.id}
            />
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
              <Button variant={submitButtonVariant} type='submit'>{submitButtonText}</Button>{' '}
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
  submitButtonText: 'Submit',
  submitButtonVariant: 'primary'
};

const Comment = ({ recipe, user, data, showReplyFormId, setShowReplyFormId }) => {
  const repliesRef = useRef(null);
  const commentRef = useRef(null);
  const [comment, setComment] = useState(data);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [replies, setReplies] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: -1,
    message: '',
    parent_id: data.id
  });

  const onSubmit = async (values, actions) => {
    setShowSubmitError(false);
    setSubmitError('');

    const data = await submitComment(user.token, recipe.id, values.id, values.parent_id, values.message);

    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
      setShowSubmitError(true);
    }
    else {
      setShowReplyFormId(-1);
      if (values.id != -1) {
        setComment({...comment, message: data.message, updated_on: data.updated_on});
      }
      else {
        replies.unshift(data);
        setReplies([...replies]);
      }
    }
  };

  const onEdit = (e) => {
    e.preventDefault();
    setInitialValues({ id: data.id, message: comment.message, parent_id: data.id });
    setTimeout(() => commentRef.current.scrollIntoView(), 100);
    setShowReplyFormId(data.id);
  };

  const onDelete = (e) => {
    e.preventDefault();
    setTimeout(() => commentRef.current.scrollIntoView(), 100);
  };

  const onReply = (e) => {
    e.preventDefault();
    setInitialValues({ id: -1, message: '', parent_id: data.id });
    setTimeout(() => commentRef.current.scrollIntoView(), 100);
    setShowReplyFormId(data.id);
  };

  const onCancel = (e) => {
    e.preventDefault();
    setShowReplyFormId(-1);
  }

  const onViewReplies = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const [replies, error] = await fetchComments(user.token, recipe.id, data.id, page);
    setIsLoading(false);
    setReplies(replies);
    repliesRef.current.scrollIntoView();
  };

  return (
  <>
    <Card ref={commentRef}>
      <Card.Header className='text-muted'>
        <Row>
          <Col md={6}>
            <span className={data.uuid == user.uuid ? 'fw-bold' : ''}>{data.name}</span>
          </Col>
          <Col className='text-end'>
            {data.uuid == user.uuid && (<>
              <Link to='#' onClick={onEdit} className='text-decoration-none me-3'>Edit</Link>
              <Link to='#' onClick={onDelete} className='text-decoration-none text-danger me-3'>Delete</Link>
            </>)}
            {new Date(data.posted_on).toLocaleString('en-US', {timezone: user.timezone })}
            <Link to={`#${data.id}`} className='text-decoration-none ms-3'>#{data.id}</Link>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {comment.message}
      </Card.Body>
      <Card.Body className='small text-muted pb-2 text-end'>
        {comment.updated_on ? (
        <span>Updated on {new Date(comment.updated_on).toLocaleString('en-US', {timezone: user.timezone })}
        </span>) : ''}
      </Card.Body>
    </Card>
    <div className='text-start text-muted ms-3'>
      <Link to='#' onClick={onViewReplies} className='text-decoration-none'>View Replies</Link>
      <Link to='#' onClick={onReply} className='text-decoration-none ms-3'>Reply</Link>
    </div>
    <Row ref={repliesRef} xs={1} className='ms-4 gy-3'>
      {isLoading && (
      <Col className='text-muted text-center'>
        <Spinner
            as='span'
            animation='border'
            size='sm'
            role='status'
            aria-hidden='true'
          />
          {' '}Loading
      </Col>
      )}
      <Col>
        {(showReplyFormId == data.id) && (
        <CommentForm 
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          showSubmitError={showSubmitError}
          errorDisplay={
          <Alert show={showSubmitError} variant='danger'>
            {(submitError ? submitError : '')}
          </Alert>
          }
          submitButtonText={initialValues.id != -1 ? 'Update' : 'Submit'}
          submitButtonVariant={initialValues.id != -1 ? 'warning' : 'primary'}
          />
        )}
      </Col>
      {!isLoading && replies.length > 0 && replies.map(reply => (
        <Col key={reply.id}>
          <Comment recipe={recipe} user={user} data={reply} showReplyFormId={showReplyFormId} setShowReplyFormId={setShowReplyFormId} />
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
  const [showReplyFormId, setShowReplyFormId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const commentsRef = useRef(null);
  const initialValues = {
    id: -1,
    message: '',
    parent_id: -1
  };

  useEffect(() => {
    getComments();
  }, [page]);

  const getComments = async () => {
    setIsLoading(true);
    const [comments, error] = await fetchComments(user.token, recipe.id, null, page);
    setIsLoading(false);
    setComments(comments);
  };

  const onSubmit = async (values, actions) => {
    console.log('values: ', values);
    setShowSubmitError(false);
    setSubmitError('');
    setSubmitting(true);

    const data = await submitComment(user.token, recipe.id, -1, values.parent_id, values.message);

    setSubmitting(false);
    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
      setShowSubmitError(true);
    }
    else {
      comments.unshift(data);
      commentsRef.current.scrollIntoView();
      setComments([...comments]);
    }
  };

  return (
  <Row xs={1} className='gy-3'>
    <Col>
      <CommentForm 
        initialValues={initialValues}
        onSubmit={onSubmit}
        showSubmitError={showSubmitError}
        title={<h2>Comments</h2>}
        errorDisplay={
        <Alert show={showSubmitError} variant='danger'>
          {(submitError ? submitError : '')}
        </Alert>
        }
        />
    </Col>
    <span className='m-0' ref={commentsRef}></span>
    {isLoading && (
    <Col className='text-muted text-center'>
      <Spinner
          as='span'
          animation='border'
          size='sm'
          role='status'
          aria-hidden='true'
        />
        {' '}Loading
    </Col>
    )}
    {!isLoading && comments.length > 0 && comments.map(comment => (
    <Col key={comment.id}>
        <Comment recipe={recipe} user={user} data={comment} showReplyFormId={showReplyFormId} setShowReplyFormId={setShowReplyFormId} />
    </Col>
    ))}
  </Row>
  );
};

export default RecipeComments;