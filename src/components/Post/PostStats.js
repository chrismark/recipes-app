import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';

const PostStats = () => {
  return (
    <Row className='mt-2 pb-2 border-bottom border-light gx-0 text-muted'>
      <Col xs={8}>
        <span className='post-stat-emojis me-2'>
          <FaRegThumbsUp className='post-action-icon post-action-like cursor-pointer fs-5' style={{color: 'blue'}} />
          <FaRegHeart className='post-action-icon post-action-love cursor-pointer fs-5' style={{color: 'red'}} />
          <FaRegGrinHearts className='post-action-icon post-action-care cursor-pointer fs-5' />
          <FaRegGrinSquint className='post-action-icon post-action-laugh cursor-pointer fs-5' />
          <FaRegSadTear className='post-action-icon post-action-sad cursor-pointer fs-5' />
          <FaRegSurprise className='post-action-icon post-action-surprise cursor-pointer fs-5' />
          <FaRegAngry className='post-action-icon post-action-angry cursor-pointer fs-5' />
        </span>
        <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>111 Likes</span>
      </Col>
      <Col className='text-end'>
        <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>114 Comments</span>
      </Col>
    </Row>
  );
};

export default PostStats;