import { useState, useMemo } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { useQueryClient } from 'react-query';
import { AppStateContext } from '../../appContext.js';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import PostContent from './PostContent';
import { doUpdateLike, doUpdateUnlike } from '../postLib';
import { useStore } from '../Toaster';

const Post = ({ user, post, onEditPost }) => {
  console.log('Post rerender');
  const navigate = useNavigate();
  const { toast } = useStore();
  const queryClient = useQueryClient();
  const { pageOffset } = useContext(AppStateContext);

  const onLikeError = (e) => {
    toast('Something happened while liking the post. Please try again later.');
  };

  const onUnlikeError = (e) => {
    toast('Something happened while unliking the post. Please try again later.');
  };

  const handleUpdateLike = async (payload) => {
    await doUpdateLike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], null, onLikeError);
  };

  const handleUpdateUnlike = async (payload) => {
    await doUpdateUnlike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], null, onUnlikeError);
  };

  const handleItemClick = (index, recipe) => {
    console.log('Clicked ', index, recipe);
    navigate('/posts/' + post.id +'/recipes/', {state: {post, index}, replace: false});
  };
  
  return (
  <Card className='post'>
    <Card.Body style={{paddingTop: '.5rem', paddingBottom: '0'}}>
      <PostHeader user={user} post={post} onClickEdit={onEditPost} />
      <PostContent post={post} onClickItem={handleItemClick} />
      <PostFooter user={user} post={post} recipeIndex={-1} statIndex={0} onLike={handleUpdateLike} onUnlike={handleUpdateUnlike} />
    </Card.Body>
  </Card>
  );
};

export default Post;