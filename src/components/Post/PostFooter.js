import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = React.memo(function PostFooter ({ post, recipeIndex, statIndex, onLike, onUnlike }) {
  // console.log('PostFooter');
  return (
    <div className='post-footer'>
      <PostStats post={post} statIndex={statIndex} />
      <PostActions 
        post={post}
        recipeIndex={recipeIndex}
        onLike={onLike}
        onUnlike={onUnlike}
        onShowComments={() => {}}
        />
      <PostComments post={post} />
    </div>
  );
});


export default PostFooter;