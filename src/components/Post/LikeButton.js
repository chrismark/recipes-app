import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaRegThumbsUp, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';

const LikeTypes = {
  'like': { text: 'Like', value: 1, tag: FaRegThumbsUp },
  'love': { text: 'Love', value: 2, tag: FaRegHeart },
  'care': { text: 'Care', value: 3, tag: FaRegGrinHearts },
  'laugh': { text: 'Laugh', value: 4, tag: FaRegGrinSquint },
  'sad': { text: 'Sad', value: 5, tag: FaRegSadTear },
  'surprise': { text: 'Surprise', value: 6, tag: FaRegSurprise },
  'angry': { text: 'Angry', value: 7, tag: FaRegAngry },
};

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
  const button = <Tag className={'fs-4 pb-1 post-action-icon cursor-pointer post-action-' + type} />
  return (
    <small className={isLiked ? 'post-action-' + type : ''}>{button}{text}</small>
  );
}

export { LikeButtonPopupIcon, LikeButtonIconText, LikeTypes };