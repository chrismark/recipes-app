import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { Form, Placeholder, Col, Row, Alert, Button, Spinner, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from 'react-query';
import { useStore } from '../Toaster';
import { useIsMounted } from '../../lib';
import SimplePaginate from '../SimplePaginate';
import { useRecipeComments, useRecipeCommentReplies, useSubmitComment, useDeleteComment } from '../recipeStore';

const schema = Yup.object().shape({
  message: Yup.string().required(),
});

const CommentForm = ({ title, initialValues, onSubmit, onCancel, placeholder, errorDisplay, submitButtonText, submitButtonVariant, isLoading }) => {
  console.log('re-render CommentForm');
  const ref = useRef(null);
  const isMounted = useIsMounted('CommentForm');
  
  return (
    <Formik
      enableReinitialize={true}
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        if (isMounted.current) {
          actions.resetForm(initialValues);
        }
      }}
      initialValues={initialValues}
      >
      {({
        handleSubmit,
        handleChange,
        values,
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
              disabled={isLoading || isSubmitting}
              as='textarea'
              name='message'
              value={values.message || ''}
              placeholder={placeholder}
              onChange={handleChange}
              rows={5}
              />
          </Form.Group>
          <div className='text-right' ref={ref}>
          {!isSubmitting ? 
            (<>
              <Button variant={submitButtonVariant} type='submit' disabled={isLoading}>{submitButtonText}</Button>{' '}
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

const ListCommentReplies = ({ recipe, user, commentId, showReplyFormId, setShowReplyFormId }) => {
  const { data: replies, error, isFetching, isIdle } = useRecipeCommentReplies(user?.token, recipe.id, commentId, 0);
  console.log('Comment query key=', [user?.token, recipe.id, commentId, 0]);

  return (<>
    {isFetching && (
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
    {!isIdle && !isFetching && replies && replies.length > 0 && replies.map(reply => (
      <Col key={reply.id}>
        <Comment recipe={recipe} user={user} data={reply} showReplyFormId={showReplyFormId} setShowReplyFormId={setShowReplyFormId} />
      </Col>
    ))}
  </>);
};

const Comment = ({ recipe, user, data, showReplyFormId, setShowReplyFormId }) => {
  console.log('Comment recipe=', recipe.id, ' comment=', data.id);
  const { toast } = useStore();
  const repliesRef = useRef(null);
  const commentRef = useRef(null);
  const isMounted = useIsMounted('Comment');
  const [comment, setComment] = useState(data);
  const [submitError, setSubmitError] = useState('');
  const [page, setPage] = useState(0);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [commentId, setCommentId] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: -1,
    message: '',
    parent_id: data.id
  });
  useRecipeCommentReplies(user?.token, recipe.id, commentId, 0, 
    // we only want to pass this here so it scrolls into the replies
    () => repliesRef.current && repliesRef.current.scrollIntoView());
  const queryClient = useQueryClient();
  const submitCommentMut = useSubmitComment(queryClient, page);
  const deleteCommentMut = useDeleteComment(queryClient, page);

  const onSubmit = async (values, actions) => {
    setSubmitError(null);

    const data = await submitCommentMut.mutateAsync({
      token: user.token, 
      recipe_id: recipe.id, 
      id: values.id, 
      parent_id: values.parent_id == -1 ? null : values.parent_id, 
      message: values.message
    });

    if (!isMounted.current) { return; }

    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
    }
    else {
      setShowReplyFormId(-1);
      if (values.id != -1) {
        setComment(c => ({...c, ...data}));
        toast('Reply updated');
      }
      else {
        setCommentId(values.parent_id);
        toast('Reply added');
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
    setIsConfirmDelete(true);
  };

  const onMouseLeave = (e) => {
    if (isConfirmDelete) {
      setIsConfirmDelete(false);
    }
  };

  const onDeleteYes = async (e) => {
    e.preventDefault();

    const data = await deleteCommentMut.mutateAsync({
      token: user.token,
      recipe_id: recipe.id,
      comment_id: comment.id
    });

    if (!isMounted.current) { return; }

    if (data.errorMessage) {

    }
    else {
      setComment({...comment, deleted: true});
      toast('Comment deleted');
    }
  }

  const onDeleteNo = (e) => {
    e.preventDefault();
    if (isConfirmDelete) {
      setIsConfirmDelete(false);
    }
  }

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
    console.log('view replies for', data.id);
    setTimeout(() => commentRef.current.scrollIntoView(), 100);
    setCommentId(data.id);
  };

  return (
  <>
    <Card ref={commentRef}>
      {comment.deleted ? (
        <Card.Body className='text-muted small fst-italic'>deleted by user</Card.Body> 
      ) : (
      <>
        <Card.Header className='text-muted'>
          <Row>
            <Col md={6}>
              <span className={data.uuid == user.uuid ? 'fw-bold' : ''}>{data.name}</span>
            </Col>
            <Col className='text-end'>
              {data.uuid == user.uuid && (<>
                <Link to='#' onClick={onEdit} className='text-decoration-none me-3'>Edit</Link>
                {!isConfirmDelete ? (
                  <Link to='#' onClick={onDelete} className='text-decoration-none text-danger me-3'>Delete</Link>
                ) : (
                <span onMouseLeave={onMouseLeave}>
                  Delete? <Link to='#' onClick={onDeleteYes} className='text-decoration-none text-danger me-1'>Yes</Link>/
                  <Link to='#' onClick={onDeleteNo} className='text-decoration-none text-primary me-3 ms-1'>No</Link>
                </span>
                )}
              </>)}
              {new Date(data.posted_on).toLocaleString('en-US', {timezone: user.timezone})}
              <Link to={`#${data.id}`} className='text-decoration-none ms-3'>#{data.id}</Link>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {comment.message}
        </Card.Body>
        <Card.Body className='small text-muted pb-2 text-end'>
          {comment.updated_on ? (
          <span>Updated on {new Date(comment.updated_on).toLocaleString('en-US', {timezone: user.timezone})}
          </span>) : ''}
        </Card.Body>
      </>
      )}
    </Card>
    <div className='text-start text-muted ms-3'>
      <Link to='#' onClick={onViewReplies} className='text-decoration-none'>View Replies</Link>
      {!comment.deleted && <Link to='#' onClick={onReply} className='text-decoration-none ms-3'>Reply</Link>}
    </div>
    <Row ref={repliesRef} xs={1} className='ms-4 gy-3'>
      <Col>
        {(showReplyFormId == data.id) && (
        <CommentForm 
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          showSubmitError={!!submitError}
          errorDisplay={
          <Alert show={!!submitError} variant='danger'>
            {(submitError ? submitError : '')}
          </Alert>
          }
          submitButtonText={initialValues.id != -1 ? 'Update' : 'Submit'}
          submitButtonVariant={initialValues.id != -1 ? 'warning' : 'primary'}
          />
        )}
      </Col>
      <ListCommentReplies recipe={recipe} user={user} commentId={commentId} showReplyFormId={showReplyFormId} setShowReplyFormId={setShowReplyFormId} />
    </Row>
  </>
  );
};

const CommentPlaceholder = () => {
  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col md={6}>
              <Placeholder animation='glow'>
                <Placeholder xs={4} size='lg' />
              </Placeholder>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
        <Placeholder animation='glow'>
          <Placeholder xs={8} size='lg' />
        </Placeholder>
        </Card.Body>
        <Card.Body className='small pb-2'></Card.Body>
      </Card>
      <div className='ms-3'>
        <Placeholder animation='glow'>
          <Placeholder xs={1} size='lg' />
        </Placeholder>
      </div>
    </>
  );
};

const ListComments = memo(({ recipe, user, page }) => {
  const [showReplyFormId, setShowReplyFormId] = useState(-1);
  const { data: comments, error, isFetching } = useRecipeComments(user?.token, recipe.id, null, page);
  console.log('ListComments query key=', [user?.token, recipe.id, null, page])

  return (<>
    {isFetching && (<>
      <Col><CommentPlaceholder /></Col>
      <Col><CommentPlaceholder /></Col>
      <Col><CommentPlaceholder /></Col>
      <Col><CommentPlaceholder /></Col>
      <Col><CommentPlaceholder /></Col>
      <Col><CommentPlaceholder /></Col>
    </>)}
    {!isFetching && comments.length > 0 && comments.map(comment => (
    <Col key={comment.id}>
        <Comment recipe={recipe} user={user} data={comment} showReplyFormId={showReplyFormId} setShowReplyFormId={setShowReplyFormId} />
    </Col>
    ))}
  </>);
});

const RecipeComments = ({ user, recipe }) => {
  console.log('RecipeComments ', recipe.id);
  const { toast } = useStore();
  const isMounted = useIsMounted('RecipeComments');
  const [submitError, setSubmitError] = useState(null);
  const [page, setPage] = useState(0);
  const commentsRef = useRef(null);
  const initialValues = {
    id: -1,
    message: '',
    parent_id: -1
  };
  const { isFetching } = useRecipeComments(user?.token, recipe.id, null, page);
  const queryClient = useQueryClient();
  const submitCommentMut = useSubmitComment(queryClient, page);

  const onSubmit = async (values, actions) => {
    console.log('values: ', values);
    setSubmitError(null);

    const data = await submitCommentMut.mutateAsync({
      token: user.token, 
      recipe_id: recipe.id, 
      id: -1, 
      parent_id: values.parent_id == -1 ? null : values.parent_id, 
      message: values.message
    });

    if (!isMounted.current) { return; }

    if (data.errorMessage) {
      setSubmitError(data.errorMessage);
    }
    else {
      commentsRef.current.scrollIntoView();
      toast('Comment added');
    }
  };

  const onPage = (page) => {
    console.log('onPage: ', page);
    setPage(page);
  };

  return (
  <Row xs={1} className='gy-3'>
    <Col>
      <CommentForm 
        isLoading={isFetching}
        initialValues={initialValues}
        onSubmit={onSubmit}
        showSubmitError={!!submitError}
        title={<h2>Comments</h2>}
        errorDisplay={
        <Alert show={!!submitError} variant='danger'>
          {(submitError ? submitError : '')}
        </Alert>
        }
        />
    </Col>
    <Col>
      <span className='m-0' ref={commentsRef}></span>
      <SimplePaginate onPage={onPage} page={page} />
    </Col>
    <ListComments recipe={recipe} user={user} page={page} />
  </Row>
  );
};

export default RecipeComments;