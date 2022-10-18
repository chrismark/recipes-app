import { Row, Col, Form } from 'react-bootstrap';
import { FaCaretDown } from 'react-icons/fa';

const PostComments = ({user, post}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit comment');
  };

  return (
    <Row className='border-top border-light gx-0 pt-1'>
      <Col xs={12} className='text-end text-muted'>
        <span className='cursor-pointer'><small>Top comments</small><FaCaretDown /></span>
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
  );
};

export default PostComments;