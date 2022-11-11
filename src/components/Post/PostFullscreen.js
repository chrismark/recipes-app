import { useState, useEffect } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderMinimal } from '../Header';

const PostFullscreen = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post: localPost } = location.state;
  const [post, setPost] = useState(localPost);

  // TODO: Fetch post from react-query using client provider
  const onClose = (e) => {
    e.preventDefault();
    navigate('/'); // Back to Posts
  };

  return (
    <Modal show={true} fullscreen={true}>
      <Modal.Body>
        <HeaderMinimal user={user} onClose={onClose} style={{margin: '-1rem'}} />
        
      </Modal.Body>
    </Modal>
  );
};

export default PostFullscreen;