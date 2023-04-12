import { PostStats } from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ post, recipeIndex, statIndex, onLike, onUnlike }) => {
  return (
    <div className='post-footer'>
      <PostStats post={post} recipeIndex={recipeIndex} statIndex={statIndex} />
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
};


export default PostFooter;