import { PostRecipesPreviewDisplay } from '../PostRecipesPreview';

const PostContent = ({ post, onClickItem }) => {
  return (
    <div className='post-content' style={{marginBottom: '-1px'}}>
      <p>{post.message}</p>
      <PostRecipesPreviewDisplay recipes={post.recipes} isClickable={true} onClick={onClickItem} />
    </div>
  );
};

export default PostContent;