import { forwardRef, useState, useEffect, useContext, useRef, useImperativeHandle, useMemo } from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Spinner, Modal } from 'react-bootstrap';
import { useQueryClient } from 'react-query';
import { LikeTypes, LikeTypesByZeroIndex } from './LikeButton';
import { usePostLikes, usePostModalLikesInitial, usePostModalLikesSucceeding } from '../postStore';
import { AppStateContext } from '../../appContext.js';
import humanNumber from 'human-number';
import PostButton from './PostButton';

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

const PostStatsIcon = ({ post, recipe, stats, type, onClick }) => {
  if (stats[type] <= 0) {
    return '';
  }
  let data = LikeTypes[type];
  const Tag = data.tag;
  const text = data.text;
  const onClickHandler = () => onClick(data.value);
  return (
    <OverlayTrigger
      placement='top'
      flip={true}
      overlay={
        <Tooltip className='tooltip-poststats' placement='top' flip='true'>
          <PostStatsTooltip post={post} recipe={recipe} text={text} type={data.value} />
        </Tooltip>
      }>
      <span onClick={onClickHandler}>
        <Tag className={'post-action-icon cursor-pointer fs-5 post-action-' + type} />
      </span>
    </OverlayTrigger>
  );
};

const PostStatsText = ({ post, recipe, stats, text, type, onClick }) => {
  if (stats.total_likes <= 0) {
    return '';
  }
  const onClickHandler = () => onClick(type);
  return (
    <OverlayTrigger
      placement='top'
      flip={true}
      overlay={
        <Tooltip className='tooltip-poststats' placement='top' flip='true'>
          <PostStatsTooltip post={post} recipe={recipe} text={text} type={type} />
        </Tooltip>
      }>
      <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={onClickHandler}>
        {!(recipe || post).liked 
          ? stats.total_likes 
          : ('You' + (stats.total_likes > 1 ? ' and ' + (stats.total_likes - 1) + ' other' : ''))}
      </span>
    </OverlayTrigger>
  );
};
PostStatsText.defaultProps = {
  type: null,
};

const PostStats = ({ post, recipeIndex, statIndex }) => {
  const refPostStatsModal = useRef(null);
  const refContainer = useRef(null);
  if (!(post.stats[statIndex]?.total_likes > 0 || post.stats[statIndex]?.comments > 0 || post.stats[statIndex]?.shares > 0)) {
    return '';
  }
  const recipe = recipeIndex == -1 ? null : post.recipes[recipeIndex];
  const stats = post.stats[statIndex];

  const onClickStats = (type) => {
    console.log('onClickStats');
    refPostStatsModal.current.showPostStatsModal(type);
  };

  return (<>
    <Row className='mt-2 mb-1 pb-2 gx-0 text-muted'>
      <Col xs={6}>
        <span className='post-stat-emojis me-2 ps-1'>
          {LikeTypesByZeroIndex.map(t => (
            <PostStatsIcon key={t.key + '-' + post.id} post={post} recipe={recipe} stats={stats} type={t.key} onClick={onClickStats} />
          ))}
        </span>
        <PostStatsText post={post} recipe={recipe} stats={stats} text='' onClick={onClickStats} />
      </Col>
      <Col className='text-end'>
        {post.stats[statIndex].comments > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].comments} comment{post.stats[statIndex].comments == 1 ? '' : 's'}</span>}
        {post.stats[statIndex].shares > 0 && <span className='post-stat small text-reset cursor-pointer user-select-none ms-2' onClick={(e) => e.preventDefault()}>{post.stats[statIndex].shares} share{post.stats[statIndex].shares == 1 ? '' : 's'}</span>}
      </Col>
    </Row>
    <div className='post-stats-modal-wrapper' ref={refContainer}>
      <PostStatsModal post={post} recipeIndex={recipeIndex} statIndex={statIndex} refContainer={refContainer} ref={refPostStatsModal} />
    </div>
  </>);
};

const PostStatsModal = forwardRef(({ post, recipeIndex, statIndex, refContainer }, ref) => {
  const [show, setShow] = useState(null);
  const [type, setType] = useState(0);
  const source = recipeIndex != -1 ? post.recipes[recipeIndex].id : null;

  useImperativeHandle(ref, () => {
    return {
      showPostStatsModal: (type) => {
        setShow(true);
        setType(type);
      }
    };
  }, [show]);

  const onClose = () => setShow(false);

  return (
    <Modal className='post-stats-modal' show={show} onHide={onClose} xs={12} backdrop='static' container={refContainer}>
      {show && <PostStatsModalContentWrapper post={post} source={source} type={type} onClose={onClose} />}
    </Modal>
  );
});

const PostStatsModalContentWrapper = ({ post, source, type, onClose }) => {
  const { user } = useContext(AppStateContext);
  const { data, isFetching } = usePostModalLikesInitial(user.uuid, user.token, post.id, source, type);

  return <PostStatsModalContent initialData={data} initialType={type} isFetching={isFetching} post={post} source={source} onClose={onClose} />;
};

const toFixed = (num, precision) => {
  const pow = 10 ** precision;
  return Math.round(num * pow) / pow;
};

const PostStatsModalTabs = ({ width, selectedType, data, keyInfixId, onClick }) => {
  const stats = useMemo(() => {
    return data.stats;
  }, [data]);
  const initialized = useRef(false);

  useEffect(() => {
    const wrapper = document.getElementById('post-stats-modal-content-wrapper');
    // if there is too much tabs then we need to hide some and show them in the dropdown
    if (wrapper && wrapper.offsetWidth >= width) {
      // headerTabs and dropdownTabs has matching tabs in them except wrapperChildren has
      // the All tab as first element
      const headerTabs = wrapper.getElementsByClassName('post-stats-modal-header-tab');
      const dropdown = document.getElementById('post-stats-modal-dropdown');
      const dropdownTabs = dropdown.getElementsByClassName('post-stats-modal-dropdown-tab');

      let totalWidth = 0;
      for (let i = 0; i < headerTabs.length; i++) {
        if (headerTabs[i]) {
          if (initialized.current) {
            // un-hide tabs so that when we this gets rerun it will function correctly
            headerTabs[i].classList.remove('d-none');
            if (dropdownTabs[i-1]) {
              dropdownTabs[i-1].classList.remove('d-none');
            }  
          }
          // accumulate width so we know when to start hiding header-tabs
          totalWidth += headerTabs[i].offsetWidth;
          console.log('totalWidth', totalWidth);
          if (i == 0) { 
            // exclude 'All' tab
            continue; 
          }
          if (totalWidth >= width) {
            // hide header-tab that goes over our specified width
            console.log('Hiding header tab ', headerTabs[i].classList.value);
            headerTabs[i].classList.add('d-none');
          }
          else {
            // hide dropdown tabs shown in the header
            // since wrapperChildren has All tab at index 0, we subtract 1 to get to matching dropdown tab
            console.log('Hiding dropdown tab ', dropdownTabs[i-1].classList.value);
            dropdownTabs[i-1].classList.add('d-none');
          }
        }
      }
      if (initialized.current) {
        const dropdown = document.getElementById('post-stats-modal-dropdown');
        if (dropdown) {
          dropdown.classList.add('d-none');
        }
      }
    }
    else {
      // hide the More dropdown trigger
      const dropdownWrapper = document.getElementById('post-stats-modal-dropdown-wrapper');
      dropdownWrapper.classList.add('d-none');
    }
    if (!initialized.current) {
      initialized.current = true;
    }
  }, [selectedType]);

  if (stats == undefined) {
    return '';
  }

  const toggleDropdown = () => {
    const dropdown = document.getElementById('post-stats-modal-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('d-none');
    }
  };

  const allClickHandler = () => {
    onClick(null);
  };

  const emoteClickHandler = (type) => {
    const dropdown = document.getElementById('post-stats-modal-dropdown');
    if (dropdown) {
      dropdown.classList.remove('d-none');
    }
    onClick(type);
  };

  const compStats = Object.keys(stats).filter(k => stats[k] > 0).sort((a,b) => stats[b] - stats[a]);

  return (
  <div id='post-stats-modal-content-wrapper' style={{position: 'absolute'}} className='d-flex flex-row flex-nowrap'>
    {compStats.length > 1 && <TabTitleText addedClassName='post-stats-modal-header-tab' isSelected={selectedType == null} onClick={allClickHandler}>All</TabTitleText>}
    {compStats.map(k =>
      <TabTitleIcon 
        addedClassName={'post-stats-modal-header-tab post-stats-modal-header-' + k + '-tab'}
        key={'tab-title-icon-' + keyInfixId + '-' + k} 
        isSelected={compStats.length == 1 ? true : (selectedType == LikeTypes[k].value)} 
        type={k} 
        count={humanNumber(stats[k], n=> toFixed(n,0))} 
        onClick={emoteClickHandler} />
    )}
    <div id='post-stats-modal-dropdown-wrapper' style={{position: 'relative', background: 'white'}}>
      <TabTitleText addedClassName='post-stats-modal-dropdown-tab' minWidth='5em' onClick={toggleDropdown}>More</TabTitleText>
      <div id='post-stats-modal-dropdown' className='d-none rounded shadow pt-2 ps-2 pe-2 pb-1' style={{position: 'absolute',  zIndex: 1059, background: 'white'}}>
      {compStats && compStats.map(k =>
        <TabTitleIcon 
          addedClassName={'post-stats-modal-dropdown-tab post-stats-modal-dropdown-' + k + '-tab'}
          isSelected={compStats.length == 1 ? true : (selectedType == LikeTypes[k].value)} 
          minWidth='5em' 
          key={'tab-title-icon-' + keyInfixId + '-' + k} 
          type={k} 
          count={humanNumber(stats[k], n=> toFixed(n,0))} 
          onClick={emoteClickHandler} />
      )}
      </div>
    </div>
  </div>);
};

const TabTitleText = ({ children, addedClassName, minWidth, isSelected, onClick }) => {
  const selected = isSelected ? 'tab-title-selected border-bottom border-2 border-primary ' : '';
  return (<div className={selected + 'pb-1 post-stats-modal-tab ' + addedClassName}>
    <div 
      style={{minWidth: minWidth||'3.5rem', minHeight: '1rem'}} 
      className='tab-title user-select-none d-flex align-items-center justify-content-center cursor-pointer justify-content-middle rounded p-2 fw-bolder text-muted' 
      onClick={onClick}>
      {children}
    </div>
  </div>);
};
TabTitleText.defaultProps = {
  addedClassName: ''
};

const TabTitleIcon = ({ addedClassName, type, count, onClick, minWidth, isSelected }) => {
  const Tag = LikeTypes[type].tag;

  const onClickHandler = () => {
    onClick(LikeTypes[type].value);
  };

  return <TabTitleText addedClassName={addedClassName} minWidth={minWidth} onClick={onClickHandler} isSelected={isSelected}>
    <Tag style={{postition: 'relative', minWidth: '1.1rem'}} className={'me-1 post-action-icon cursor-pointer fs-5 post-action-' + type} />
    <span className='fw-bold'>{count < 1000 ? count : humanNumber(count, n=>toFixed(parseFloat(n),0))}</span>
  </TabTitleText>;
};

const PostStatsModalContent = ({ initialData, isFetching, post, source, initialType, onClose }) => {
  const [type, setType] = useState(initialType);
  const WIDTH = 325;

  const onClick = (type) => {
    setType(type);
  };

  return (<>
  <Modal.Body className='ps-3 pt-1 pb-1 pe-3' style={{overflowY: 'auto', minHeight: '500px'}}>
    <div className='d-flex flex-row justify-content-between'>
      <div className='flex-grow-1 overflow-hidden' style={{maxWidth: WIDTH + 'px'}}>
        {!isFetching && initialData && <PostStatsModalTabs width={WIDTH} selectedType={type} data={initialData} keyInfixId={post.id} onClick={onClick} />}
      </div>
      <div className='justify-content-between ml-auto' style={{zIndex: 9999}}>
        <div className='d-flex align-items-center justify-content-center cursor-pointer justify-content-middle pt-2 pb-2 pe-0 rounded'>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
    </div>
    {isFetching && <div className='d-flex justify-content-sm-center pt-2 pb-2'><Spinner animation='border' size='md' /></div>}
    {!isFetching && <PostStatsModalUserList post={post} source={source} type={type} initialType={initialType} />}
  </Modal.Body>
  </>);
};

const PostStatsModalUserList = ({ type, post, source, initialType }) => {
  const { user } = useContext(AppStateContext);
  const { data, isFetching } = usePostModalLikesSucceeding(user.uuid, user.token, post.id, source, initialType, type);

  if (isFetching) {
    return <div className='d-flex justify-content-sm-center pt-2 pb-2'><Spinner animation='border' size='md' /></div>;
  }
  return <div className='mt-2'>
    {data?.users && data?.users.map((user,i) => <PostStatsModalUser key={'user-' + i + '-' + user.type} user={user} />)}
  </div>
};

const PostStatsModalUser = ({ user }) => {
  const likeType = LikeTypesByZeroIndex[user.type - 1];
  const Tag = likeType.tag;
  return (<div className='post-stats-modal-user d-flex align-items-center pt-2 pb-2'>
    <a className='fs-6 fw-bold text-muted'>{user.name}</a>
    <Tag style={{position: 'relative', bottom: '-.3rem', left: '.15rem', fontSize: '10pt'}} className={'me-1 post-action-icon cursor-pointer post-action-' + likeType.key} />
  </div>);
};

export { PostStats, PostStatsModal };