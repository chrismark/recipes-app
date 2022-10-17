import TimeAgo from './TimeAgo';
import { FaEllipsisH } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';

const PostHeader = ({ user, post }) => {
  return (
    <Row className='mb-2'>
      <Col>
        <div className='post-user fw-bold pt-0'>{user.username || user.firstname}</div>
        <div style={{marginTop: '-.5rem'}} className='post-timestamp'>
          <TimeAgo date={new Date(post.posted_on)} />
        </div>
      </Col>
      <Col className='text-end'>
        <FaEllipsisH className='cursor-pointer fs-4' onClick={() => console.log('clicked on Post Options.')} />
      </Col>
    </Row>
  );
};

export default PostHeader;