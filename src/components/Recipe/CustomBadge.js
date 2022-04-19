import { Badge, Card } from 'react-bootstrap';

const CustomBadge = ({ children, type }) => {
  return (
    <h6 style={{marginTop: '-.4em'}}>
      <Badge bg={type} style={{verticalAlign: 'middle'}}>
        <small>{children}</small>
      </Badge>
    </h6>
  );
};

export default CustomBadge;