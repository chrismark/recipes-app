import PostHeader from './PostHeader';
import Card from 'react-bootstrap/Card';
import { PostRecipesPreviewDisplay } from '../PostRecipesPreview'

const Post = ({ user, post }) => {
  return (
  <Card>
    <Card.Body style={{marginTop: '-.5rem'}}>
      <PostHeader user={user} post={post} />
      <p>{post.message}</p>
      <PostRecipesPreviewDisplay recipes={post.recipes} onClick={() => console.log('click')} />
      <div style={{marginTop: '1rem'}}>Post Actions Here</div>
    </Card.Body>
  </Card>
  );
};

export default Post;