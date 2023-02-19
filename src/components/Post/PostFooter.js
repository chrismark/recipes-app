import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ post, recipeIndex, onLike, onUnlike }) => {
  // TODO: Why does all PostFooter have to rerender?
  // console.log('PostFooter rerender');
  let [showComments, setShowComments] = useState(false);

  console.log('PostFooter', recipeIndex, post.stats[recipeIndex]);

  const doShowComments = () => {
    setShowComments(true);
  };

  return (
    <div className='post-footer'>
      {(post.stats[recipeIndex]?.total_likes > 0 || post.stats[recipeIndex].comments > 0 || post.stats[recipeIndex].shares > 0) && <PostStats post={post} recipeIndex={recipeIndex} />}
      <PostActions 
        post={post}
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