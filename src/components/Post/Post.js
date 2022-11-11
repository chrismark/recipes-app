import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import { PostRecipesPreviewDisplay } from '../PostRecipesPreview'

const Post = ({ user, post, onEditPost }) => {
  const navigate = useNavigate();

  const handleItemClick = (recipe) => {
    console.log('Clicked ', recipe);
    navigate('/posts/' + post.id +'/recipes/', {state: {post: post}});
  };

  return (
  <Card>
    <Card.Body style={{paddingTop: '.5rem', paddingBottom: '.1rem'}}>
      <PostHeader user={user} post={post} onClickEdit={onEditPost} />
      <p>{post.message}</p>
      <PostRecipesPreviewDisplay recipes={post.recipes} isClickable={true} onClick={handleItemClick} />
      <PostFooter user={user} post={post} />
    </Card.Body>
  </Card>
  );
};

export default Post;