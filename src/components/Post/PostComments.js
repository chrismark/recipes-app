import { Row, Col } from 'react-bootstrap';

const PostComments = ({}) => {
  return (
    <Row className='border-top border-light gx-0'>
      <Col xs={12} className='text-end'>
        Top Comments
      </Col>
      <Col xs={12}>
        Form goes here
      </Col>
    </Row>
  );
};

export default PostComments;