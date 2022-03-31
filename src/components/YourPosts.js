import MainContainer from './MainContainer';
import Posts from './Posts';


const YourPosts = ({ user }) => {
  return (
    <MainContainer user={user}>
      <Posts user={user} byUser={true} />
    </MainContainer>
  );
};

export default YourPosts;