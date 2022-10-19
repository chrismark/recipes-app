import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ user, post }) => {
  let [showComments, setShowComments] = useState(false);

  const doShowComments = () => {
    setShowComments(true);
  };

  return (
    <>
      <PostStats />
      <PostActions 
        onLike={() => console.log('click Like')} 
        onShowComments={doShowComments}
        />
      <PostComments show={showComments} />
    </>
  );
};

export default PostFooter;