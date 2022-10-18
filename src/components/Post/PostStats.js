import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';

const PostStats = ({}) => {
  return (
    <Row className='mt-2 pb-2 border-bottom border-light gx-0 text-muted'>
      <Col>
        <span className='post-stat-emojis me-2'>
          <FaRegThumbsUp className='cursor-pointer fs-5' style={{color: 'blue'}} />
          <FaRegHeart className='cursor-pointer fs-5' style={{color: 'red'}} />
          <FaRegGrinHearts className='cursor-pointer fs-5' />
          <FaRegGrinSquint className='cursor-pointer fs-5' />
          <FaRegSadTear className='cursor-pointer fs-5' />
          <FaRegSurprise className='cursor-pointer fs-5' />
          <FaRegAngry className='cursor-pointer fs-5' />
        </span>
        <a className='post-stat small text-reset cursor-pointer user-select-none'>111 Likes</a>
      </Col>
      <Col className='text-end'>
        <a className='post-stat small text-reset cursor-pointer user-select-none'>114 Comments</a>
      </Col>
    </Row>
  );
};

export default PostStats;