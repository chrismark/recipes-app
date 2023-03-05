import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useQueryClient } from 'react-query';
import { AppStateContext, AppDispatchContext } from '../appContext.js';
import { useStore } from './Toaster';
import Post from './Post/Post';
import PostPlaceholder from './Post/PostPlaceholder';
import { useUserPosts } from './postStore';
import { doUpdateLike, doUpdateUnlike } from './postLib';

const Posts = ({ onEditPost, byUser }) => {
  console.log('Posts rerender');
  const { toast } = useStore();
  const { user, pageOffset } = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);
  const useUserPostsResult = useUserPosts(user?.uuid, user?.token, pageOffset);
  const { data: posts, error, isFetching, isLoading } = useUserPostsResult;
  const queryClient = useQueryClient();
  const size = 20;
  const postCount = 300;

  console.log('Posts', 'user:', user, 'pageOffset:', pageOffset);

  // TODO: Continuosly load more posts when user scrolls to bottom most
  // TODO: Load posts made by user

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    dispatch({ type: 'update_pageOffset', pageOffset: (page - 1) * size });
  };

  //
  // TODO: Make it so not all posts rerender when a single post is liked
  //
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

  return (
    <Row xs={1} className='posts-list gy-4'>
      {isLoading && (<>
        <Col className='justify-content-md-center' key={1}>
          <PostPlaceholder />
        </Col>
        <Col className='justify-content-md-center' key={2}>
          <PostPlaceholder />
        </Col>
        <Col className='justify-content-md-center' key={3}>
          <PostPlaceholder />
        </Col>
      </>)}
      {posts && posts.map(post => (
        <Col className='justify-content-md-center' key={post.id}>
          <Post user={user} post={post} onEditPost={onEditPost} onLike={handleUpdateLike} onUnlike={handleUpdateUnlike} />
        </Col>
      ))}
    </Row>
  );
};

Posts.defaultProps = {
  byUser: false
};

export default Posts;