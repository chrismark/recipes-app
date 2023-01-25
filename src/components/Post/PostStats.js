import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import { LikeTypes } from './LikeButton';

const PostStats = ({ post }) => {
  const onClickLikeStat = (type) => {
    console.log(type, post.stats[type]);
  };

  return (
    <Row className='mt-2 pb-2 border-bottom border-light gx-0 text-muted'>
      <Col xs={6}>
        <span className='post-stat-emojis me-2'>
          {post.stats.like > 0 && <FaRegThumbsUp className='post-action-icon post-action-like cursor-pointer fs-5' onClick={() => onClickLikeStat('like')} />}
          {post.stats.love > 0 && <FaRegHeart className='post-action-icon post-action-love cursor-pointer fs-5' onClick={() => onClickLikeStat('love')} />}
          {post.stats.care > 0 && <FaRegGrinHearts className='post-action-icon post-action-care cursor-pointer fs-5' onClick={() => onClickLikeStat('care')} />}
          {post.stats.laugh > 0 && <FaRegGrinSquint className='post-action-icon post-action-laugh cursor-pointer fs-5' onClick={() => onClickLikeStat('laugh')} />}
          {post.stats.sad > 0 && <FaRegSadTear className='post-action-icon post-action-sad cursor-pointer fs-5' onClick={() => onClickLikeStat('sad')} />}
          {post.stats.surprise > 0 && <FaRegSurprise className='post-action-icon post-action-surprise cursor-pointer fs-5' onClick={() => onClickLikeStat('surprise')} />}
          {post.stats.angry > 0 && <FaRegAngry className='post-action-icon post-action-angry cursor-pointer fs-5' onClick={() => onClickLikeStat('angry')} />}
        </span>
        {post.stats.total_likes > 0 && (
          <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={() => console.log(post.stats)}>{!post.liked ? post.stats.total_likes : (
            'You' + (post.stats.total_likes > 1 ? ' and ' + (post.stats.total_likes - 1) + 'other' : '')
          )}</span>
        )}
      </Col>
      <Col className='text-end'>
        {post.stats.comments > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>{post.stats.comments} comment{post.stats.comments == 1 ? '' : 's'}</span>}
        {post.stats.shares > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none ms-2' onClick={(e) => e.preventDefault()}>{post.stats.shares} share{post.stats.shares == 1 ? '' : 's'}</span>}
      </Col>
    </Row>
  );
};

export default PostStats;