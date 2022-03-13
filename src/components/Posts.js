import { useState, useEffect } from 'react';

const Posts = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async function() {
      if (user) {
        // Fetch posts
        await fetchPosts();
      }
      
    })();
  }, [/** dependencies */]);

  const fetchPosts = async (token) => {
    try {
      const result = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
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
      const result = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const post = await result.json();
      
    }
    catch (e) {
      console.error(e);
    }
  };

  return (
    <>
    </>
  );
};

export default Posts;