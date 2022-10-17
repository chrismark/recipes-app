import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegCommentAlt } from 'react-icons/fa';

const PostLike = () => {
  return (
    <></>
  );
};

const PostActions = () => {
  return (
    <Row className='mt-1 mb-1'>
      <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
        <small><FaRegThumbsUp className='fs-4 pb-1' />Like</small>
      </Col>
      <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
        <small><FaRegCommentAlt /> Comment</small>
      </Col>
      <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
        <small>Share</small>
      </Col>
    </Row>
  );
};

export default PostActions;