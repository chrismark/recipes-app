import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';

const LikeTypes = {
  'like': { key: 'like', text: 'Like', value: 1, tag: FaRegThumbsUp },
  'love': { key: 'love', text: 'Love', value: 2, tag: FaRegHeart },
  'care': { key: 'care', text: 'Care', value: 3, tag: FaRegGrinHearts },
  'laugh': { key: 'laugh', text: 'Laugh', value: 4, tag: FaRegGrinSquint },
  'sad': { key: 'sad', text: 'Sad', value: 5, tag: FaRegSadTear },
  'surprise': { key: 'surprise', text: 'Surprise', value: 6, tag: FaRegSurprise },
  'angry': { key: 'angry', text: 'Angry', value: 7, tag: FaRegAngry },
};

const LikeTypesByZeroIndex = Object.values(LikeTypes);

const LikeButtonPopupIcon = ({ type, onClick }) => {
  let data = LikeTypes[type];
  const Tag = data.tag;
  const text = data.text;
  const handler = () => onClick(data.value);
  const button = <Tag className={'post-action-icon cursor-pointer post-action-' + type} onClick={handler} />
  return (
    <OverlayTrigger
        key={text}
        placement='top'
        overlay={
          <Tooltip id={`tooltip-${text}`}>{text}</Tooltip>
        }
      >
      <span className='d-inline-flex'>{button}</span>
    </OverlayTrigger>
  );
};

const LikeButtonIconText = ({ isLiked, type, onClick }) => {
  let data = LikeTypes[type || 'like'];
  const Tag = data.tag;
  const text = data.text;
  const button = <Tag className={'fs-4 pb-1 me-1 post-action-icon cursor-pointer post-action-' + type} />
  return (
    <small className={'fs-8 ' + (isLiked ? 'post-action-' + type : '')}>{button}{text}</small>
  );
};

const ButtonIconText = ({ children, Tag, type }) => {
  const button = <Tag className={'fs-4 pb-1 me-1 post-action-icon cursor-pointer post-action-' + type} />
  return (
    <small className='fs-8'>{button}{children}</small>
  );
};

export { LikeButtonPopupIcon, LikeButtonIconText, ButtonIconText, LikeTypes, LikeTypesByZeroIndex };