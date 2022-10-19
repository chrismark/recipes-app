import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FaCaretDown } from 'react-icons/fa';

const PostComments = ({user, post, show}) => {
  let [page, setPage] = useState(0);

  useEffect(() => {
    if (show) {
      console.log('Load comments');
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit comment');
  };

  return (
    <>
    {show ? (
      <Row className='border-top border-light gx-0 pt-1 pb-2'>
        <Col xs={12} className='text-end text-muted'>
          <span className='cursor-pointer'><small>All comments</small><FaCaretDown /></span>
        </Col>
        <Col xs={12}>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              placeholder='Write a comment...'
              className='rounded-pill mt-2'
              />
          </Form>
        </Col>
      </Row>
    ) : ''}
    </>
  );
};

PostComments.defaultProps = {
  show: false,
};

export default PostComments;