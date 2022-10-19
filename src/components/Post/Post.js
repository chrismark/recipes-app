import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import Card from 'react-bootstrap/Card';
import { PostRecipesPreviewDisplay } from '../PostRecipesPreview'

const Post = ({ user, post }) => {
  return (
  <Card>
    <Card.Body style={{paddingTop: '.5rem', paddingBottom: '.1rem'}}>
      <PostHeader user={user} post={post} />
      <p>{post.message}</p>
      <PostRecipesPreviewDisplay recipes={post.recipes} onClick={() => console.log('click')} />
      <PostFooter user={user} post={post} />
    </Card.Body>
  </Card>
  );
};

export default Post;