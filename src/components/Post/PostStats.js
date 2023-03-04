import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import { LikeTypes } from './LikeButton';

const PostStats = ({ post, statIndex }) => {
  // console.log('PostStats', post.id, statIndex, post.stats[statIndex]);

  const onClickLikeStat = (type) => {
    // console.log(type, post.stats[statIndex][type]);
  };

  if (!(post.stats[statIndex]?.total_likes > 0 || post.stats[statIndex]?.comments > 0 || post.stats[statIndex]?.shares > 0)) {
    return <></>;
  }

  return (
    <Row className='mt-2 pb-2 border-bottom border-light gx-0 text-muted'>
      <Col xs={6}>
        <span className='post-stat-emojis me-2'>
          {post.stats[statIndex].like > 0 && <FaRegThumbsUp className='post-action-icon post-action-like cursor-pointer fs-5' onClick={() => onClickLikeStat('like')} />}
          {post.stats[statIndex].love > 0 && <FaRegHeart className='post-action-icon post-action-love cursor-pointer fs-5' onClick={() => onClickLikeStat('love')} />}
          {post.stats[statIndex].care > 0 && <FaRegGrinHearts className='post-action-icon post-action-care cursor-pointer fs-5' onClick={() => onClickLikeStat('care')} />}
          {post.stats[statIndex].laugh > 0 && <FaRegGrinSquint className='post-action-icon post-action-laugh cursor-pointer fs-5' onClick={() => onClickLikeStat('laugh')} />}
          {post.stats[statIndex].sad > 0 && <FaRegSadTear className='post-action-icon post-action-sad cursor-pointer fs-5' onClick={() => onClickLikeStat('sad')} />}
          {post.stats[statIndex].surprise > 0 && <FaRegSurprise className='post-action-icon post-action-surprise cursor-pointer fs-5' onClick={() => onClickLikeStat('surprise')} />}
          {post.stats[statIndex].angry > 0 && <FaRegAngry className='post-action-icon post-action-angry cursor-pointer fs-5' onClick={() => onClickLikeStat('angry')} />}
        </span>
        {post.stats[statIndex].total_likes > 0 && (
          <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={() => console.log(post.stats[statIndex])}>
            {!post.liked ? post.stats[statIndex].total_likes : 
              ('You' + (post.stats[statIndex].total_likes > 1 ? ' and ' + (post.stats[statIndex].total_likes - 1) + ' other' : ''))
            }
          </span>
        )}
      </Col>
      <Col className='text-end'>
        {post.stats[statIndex].comments > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].comments} comment{post.stats[statIndex].comments == 1 ? '' : 's'}</span>}
        {post.stats[statIndex].shares > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none ms-2' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].shares} share{post.stats[statIndex].shares == 1 ? '' : 's'}</span>}
      </Col>
    </Row>
  );
};

export default PostStats;