import { Card, ListGroup, ListGroupItem, Placeholder } from 'react-bootstrap';

const RecipePlaceholder = () => {
  return (
    <Card flush>
      <Placeholder style={{verticalAlign: 'middle', width: '100%', height: '27vh'}} className='card-img card-img-top'>
        <Placeholder xs={12} size='lg' />
      </Placeholder>
      <Card.Body>
        <Placeholder as={Card.Title} animation='glow'>
          <span className='h5'>
            <Placeholder xs={6} size='lg' />
          </span>
        </Placeholder>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem to='#' style={{textAlign: 'center'}}>
          <Placeholder animation='glow'>
          <span className='h5'>
            <Placeholder xs={6} size='lg' />
          </span>
          </Placeholder>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default RecipePlaceholder;