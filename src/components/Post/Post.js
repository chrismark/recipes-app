import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import PostContent from './PostContent';

const Post = ({ user, post, onEditPost, onLike, onUnlike }) => {
  console.log('Post rerender');
  const navigate = useNavigate();

  const handleItemClick = (index, recipe) => {
    console.log('Clicked ', index, recipe);
    navigate('/posts/' + post.id +'/recipes/', {state: {post: post, index: index}, replace: false});
  }
  
  return (
  <Card className='post'>
    <Card.Body style={{paddingTop: '.5rem', paddingBottom: '.1rem'}}>
      <PostHeader user={user} post={post} onClickEdit={onEditPost} />
      <PostContent post={post} onClickItem={handleItemClick} />
      <PostFooter user={user} post={post} recipeIndex={-1} statIndex={0} onLike={onLike} onUnlike={onUnlike} />
    </Card.Body>
  </Card>
  );
};

export default Post;