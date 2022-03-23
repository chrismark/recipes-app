import { Offcanvas, Figure, ListGroup, ListGroupItem, Row, Col, Image } from 'react-bootstrap';

const QuickViewSidebar = ({ show, onClose, recipe }) => {

  const formatCredits = (recipe) => {
    const credits = recipe.credits;
    let output = '';
    if (credits && credits.length) {
      if (credits[0].type === 'brand') {
        return (
          <Row >
            <Col xs={2} className='gx-2'><Image src={credits[0].image_url} fluid /></Col>
            <Col className='gx-3'>
              <div className='h5' style={{marginBottom: 0, alignItems: 'start'}}>Presented by</div>
              <div className='h3 fw-bolder'>{credits[0].name}</div>
            </Col>
          </Row>
        );
      }
      else if (credits[0].type === 'community') {
        let names = credits.reduce((prev, cur, idx) => 
          (idx === 0) ? cur : 
            (idx == credits.length - 1 ? prev + ' & ' + cur : prev + ', ' + cur));
        return (<><h3>{names}</h3><h5>Community</h5></>);
      }
      else if (credits[0].type === 'internal') {
        let names = credits.reduce((prev, cur, idx) => 
          (idx === 0) ? cur : 
            (idx == credits.length - 1 ? prev + ' & ' + cur : prev + ', ' + cur));
        return (<><h3>{names}</h3><h5>Tasty Team</h5></>);
      }
    }
  };

  return (
    <Offcanvas show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h3>{recipe.name}</h3></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Figure>
          <Figure.Image src={recipe.thumbnail_url} />
        </Figure>
        <Row>
          <Col>{recipe.description}</Col>
        </Row>
        <Row>
          <Col>{formatCredits(recipe)}</Col>
        </Row>
        
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default QuickViewSidebar;