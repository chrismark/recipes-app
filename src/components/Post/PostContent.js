import { useMemo } from 'react';
import { PostRecipesPreviewDisplay } from '../PostRecipesPreview';

const PostContent = ({ post, onClickItem }) => {
  const content = post.message.split(/\n/g).map((m,i) => (
      <div key={'p-' + post.id + '-' + i} dir='auto' style={{textAlign: 'start'}}>{m}</div>
    ));
  return (
    <div className='post-content' style={{marginBottom: '-1px'}}>
      <div className='post-content mb-3'>{content}</div>
      <PostRecipesPreviewDisplay recipes={post.recipes} isClickable={true} onClick={onClickItem} />
    </div>
  );
};

const PostContentFullscreen = ({ post, message }) => {
  const content = (message == null ? '' : message.split(/\n/g).map((m,i) => (
    <div key={'p-' + post.id + '-' + i} dir='auto' style={{textAlign: 'start'}}>{m}</div>
  )));
  return (
    <div className='post-content' style={{marginBottom: '-1px'}}>
      <div className='post-content mb-3'>{content}</div>
    </div>
  );
};

export default PostContent;
export { PostContentFullscreen };
