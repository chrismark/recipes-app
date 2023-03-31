import { forwardRef, useEffect, useContext } from 'react';
import { Row, Col, Overlay, OverlayTrigger, Tooltip, Spinner, Popover } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import { LikeTypes, LikeTypesByZeroIndex } from './LikeButton';
import { usePostLikes, usePostRecipeLikes } from '../postStore';
import { AppStateContext } from '../../appContext.js';

const PostStatsTooltip = ({ post, recipe, text, type }) => {
  const { user } = useContext(AppStateContext);
  const { data, isFetching } = usePostLikes(user.uuid, user.token, post.id, recipe ? recipe.id : null, type);
  return (
  <div style={{minWidth: '80px'}}>
    {isFetching && <Spinner animation='border' size='md' className='m-auto' />}
    {!isFetching && 
    <div className='text-start'>
      <div className='fw-bold mb-1'>{text}</div>
      {data?.users.map((u,i) => (<div key={'name' + i}>{u.name}</div>))}
    </div>
    }
  </div>);
};

const PostStatsIcon = ({ post, recipe, stats, type }) => {
  if (stats[type] <= 0) {
    return '';
  }
  let data = LikeTypes[type];
  const Tag = data.tag;
  const text = data.text;
  return (
    <OverlayTrigger
      placement='top'
      flip={true}
      overlay={
        <Tooltip className='tooltip-poststats' placement='top' flip='true'>
          <PostStatsTooltip post={post} recipe={recipe} text={text} type={data.value} />
        </Tooltip>
      }>
      <span onClick={() => console.log('Clicked on ' + text)}>
        <Tag className={'post-action-icon cursor-pointer fs-5 post-action-' + type} />
      </span>
    </OverlayTrigger>
  );
};

const PostStatsText = ({ post, recipe, stats, text }) => {
  if (stats.total_likes <= 0) {
    return '';
  }
  return (
    <OverlayTrigger
      placement='top'
      flip={true}
      overlay={
        <Tooltip className='tooltip-poststats' placement='top' flip='true'>
          <PostStatsTooltip post={post} recipe={recipe} text={text} type={null} />
        </Tooltip>
      }>
      <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={() => console.log(stats)}>
        {!(recipe || post).liked 
          ? stats.total_likes 
          : ('You' + (stats.total_likes > 1 ? ' and ' + (stats.total_likes - 1) + ' other' : ''))}
      </span>
    </OverlayTrigger>
  );
}

const PostStats = ({ post, recipeIndex, statIndex }) => {
  if (!(post.stats[statIndex]?.total_likes > 0 || post.stats[statIndex]?.comments > 0 || post.stats[statIndex]?.shares > 0)) {
    return '';
  }
  const recipe = recipeIndex == -1 ? null : post.recipes[recipeIndex];
  const stats = post.stats[statIndex];
  return (
    <Row className='mt-2 mb-1 pb-2 gx-0 text-muted'>
      <Col xs={6}>
        <span className='post-stat-emojis me-2 ps-1'>
          {LikeTypesByZeroIndex.map(t => (
            <PostStatsIcon key={t.key + '-' + post.id} post={post} recipe={recipe} stats={stats} type={t.key} />
          ))}
        </span>
        <PostStatsText post={post} recipe={recipe} stats={stats} text='' />
      </Col>
      <Col className='text-end'>
        {post.stats[statIndex].comments > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].comments} comment{post.stats[statIndex].comments == 1 ? '' : 's'}</span>}
        {post.stats[statIndex].shares > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none ms-2' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].shares} share{post.stats[statIndex].shares == 1 ? '' : 's'}</span>}
      </Col>
    </Row>
  );
};

export default PostStats;