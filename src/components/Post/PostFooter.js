import { Row, Col } from 'react-bootstrap';
import PostStats from './PostStats';
import PostActions from './PostActions';
import PostComments from './PostComments';

const PostFooter = ({ user, post }) => {
  return (
    <>
      <PostStats />
      <PostActions />
      <PostComments />
    </>
  );
};

export default PostFooter;