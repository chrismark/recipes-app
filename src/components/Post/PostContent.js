import { PostRecipesPreviewDisplay } from '../PostRecipesPreview';

const PostContent = ({ post, onClickItem }) => {
  return (
    <>
      <p>{post.message}</p>
      <PostRecipesPreviewDisplay recipes={post.recipes} isClickable={true} onClick={onClickItem} />
    </>
  );
};

export default PostContent;