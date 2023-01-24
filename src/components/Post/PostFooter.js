import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ post }) => {
  let [showComments, setShowComments] = useState(false);

  const doShowComments = () => {
    setShowComments(true);
  };

  return (
    <div className='post-footer'>
      <PostStats />
      <PostActions 
        post={post}
        onLike={() => console.log('click Like')} 
        onShowComments={doShowComments}
        />
      <PostComments show={showComments} />
    </div>
  );
};

export default PostFooter;