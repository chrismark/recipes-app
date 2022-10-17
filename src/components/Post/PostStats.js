import { Row, Col } from 'react-bootstrap';

const PostStats = ({}) => {
  return (
    <Row className='mt-2 pb-1 border-bottom border-light gx-0 text-muted'>
      <Col>
        <small>111 Likes</small>
      </Col>
      <Col className='text-end'>
        <small>114 Comments </small>
      </Col>
    </Row>
  );
};

export default PostStats;