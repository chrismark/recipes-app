import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ post, recipeIndex, statIndex, onLike, onUnlike }) => {
  // TODO: Why does all PostFooter have to rerender?
  // console.log('PostFooter rerender');
  let [showComments, setShowComments] = useState(false);

  // console.log('PostFooter', recipeIndex, post.stats[statIndex]);
  // console.log('onLike', onLike, 'onUnlike', onUnlike);

  const doShowComments = () => {
    setShowComments(true);
  };

  return (
    <div className='post-footer'>
      {(post.stats[statIndex]?.total_likes > 0 || post.stats[statIndex]?.comments > 0 || post.stats[statIndex]?.shares > 0) && <PostStats post={post} statIndex={statIndex} />}
      <PostActions 
        post={post}
        recipeIndex={recipeIndex}
        onLike={onLike}
        onUnlike={onUnlike}
        onShowComments={doShowComments}
        />
      <PostComments show={showComments} post={post} />
    </div>
  );
};

PostFooter.defaultProps = {
  recipeIndex: 0,
};

export default PostFooter;