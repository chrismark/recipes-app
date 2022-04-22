import { Card } from 'react-bootstrap';
import CustomBadge from './CustomBadge';

const CardImgBadge = ({ children, type }) => {
  return (
    <Card.Body style={{position: 'absolute'}}>
      <Card.Title>
        <CustomBadge type={type}>{children}</CustomBadge>
      </Card.Title>
    </Card.Body>
  );
};

export default CardImgBadge;