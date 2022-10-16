import TimeAgo from './TimeAgo';

const PostHeader = ({ user, post }) => {
  return <div className='mb-2'>
    <div className='post-user fw-bold pt-0'>{user.username || user.firstname}</div>
    <div style={{marginTop: '-.5rem'}} className='post-timestamp text-muted'>
      <TimeAgo date={new Date(post.posted_on)} />
    </div>
  </div>;
};

export default PostHeader;