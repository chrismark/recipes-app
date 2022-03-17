import Posts from './Posts';

const YourPosts = ({ user }) => {
  return (
    <Posts user={user} byUser={true} />
  );
};

export default YourPosts;