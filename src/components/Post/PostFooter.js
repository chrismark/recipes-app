import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ post, onLike, onUnlike }) => {
  // TODO: Why does all PostFooter have to rerender?
  // console.log('PostFooter rerender');
  let [showComments, setShowComments] = useState(false);

  const doShowComments = () => {
    setShowComments(true);
  };

  return (
    <div className='post-footer'>
      {(post.stats.total_likes > 0 || post.stats.comments > 0 || post.stats.shares > 0) && <PostStats post={post} />}
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

export default PostFooter;