import { Card, ListGroup, ListGroupItem, Placeholder } from 'react-bootstrap';

const RecipePlaceholder = ({ showLinkSection }) => {
  return (
    <Card>
      <span className='placeholder-glow'>
        <img className='placeholder card-img card-img-top' src={'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9ImN1cnJlbnRDb2xvciIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIvPjwvc3ZnPg'} />
      </span>
      <Card.Body>
        <Placeholder as={Card.Title} animation='glow'>
            <Placeholder xs={10} size='lg' />
        </Placeholder>
      </Card.Body>
      {showLinkSection && (
        <ListGroup flush='true'>
        <ListGroupItem to='#' style={{textAlign: 'center'}}>
          <Placeholder animation='glow'>
          <span className='h5'>
            <Placeholder xs={6} size='lg' />
          </span>
          </Placeholder>
        </ListGroupItem>
      </ListGroup>
      )}
    </Card>
  );
};

RecipePlaceholder.defaultProps = {
  showLinkSection: true,
};

export default RecipePlaceholder;