import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import Paginate from './Paginate';

const Posts = ({ user, byUser = false }) => {
  const [posts, setPosts] = useState([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [enableFirstPageLink, setEnableFirstPageLink] = useState(false);
  const [enablePrevPageLink, setEnablePrevPageLink] = useState(false);
  const [enableNextPageLink, setEnableNextPageLink] = useState(false);
  const [enableLastPageLink, setEnableLastPageLink] = useState(false);
  const size = 20;
  const postCount = 300;

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [pageOffset]);

  const determinePageLinkAbleness = () => {
    const isFirstPageLinkEnabled = !(pageOffset > 0);
    const isOtherPageLinkEnabled = !( postCount - (size * (pageOffset + 1)) );
    setEnableFirstPageLink(isFirstPageLinkEnabled);
    setEnablePrevPageLink(isFirstPageLinkEnabled);
    setEnableNextPageLink(isOtherPageLinkEnabled);
    setEnableLastPageLink(isOtherPageLinkEnabled);
  };

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    setPageOffset((page - 1) * size);
  };

  const getPosts = async() => {
    if (byUser) {
      // Fetch posts
      await fetchUserPosts(user);
    }
    else {
      await fetchAllPosts(user);
    }
    determinePageLinkAbleness();
  };

  const fetchAllPosts = async({token}) => {
    try {
      const result = await fetch(`/api/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      let data = await result.json();
      // TODO: Remove after testing
      // Fill up posts with dummy objects
      data = [];
      for (let i = pageOffset, m = i + size; i < m && i < postCount; i++) {
        data.push({id: i});
      }
      console.log('posts: ', data);
      setPosts(data);
    }
    catch (e) {
      console.error(e);
    }
  };

  const fetchUserPosts = async ({id, token}) => {
    try {
      const result = await fetch(`/api/users/${id}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const posts = await result.json();
      setPosts(posts);
    }
    catch (e) {
      console.error(e);
    }
  };

  const createPost = async (payload) => {
    try {
      const result = await fetch(`/api/users/${user.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const post = await result.json();
      return post;
    }
    catch (e) {
      console.error(e);
    }
  };

  return (
    <Container fluid className='recipes-app-posts'>
      <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} className='gy-4'>
        {posts.map((post) => (
          <Col key={post.id}>
            <Card>
              <Card.Body>
                <span className='h2'>{post.id}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {posts.length > 0 && (<>
        <br/><br/>
        <Paginate totalCount={postCount} pageOffset={pageOffset} size={size} dataSource={posts} onPage={getPage} />
      </>)}
    </Container>
  );
};

export default Posts;