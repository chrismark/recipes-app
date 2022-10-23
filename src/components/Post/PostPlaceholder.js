import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

const PostPlaceholder = () => {
  return (
  <Card>
    <Card.Body style={{paddingTop: '.5rem', paddingBottom: '.1rem'}}>
      <Row className='mb-2'>
        <Col>
          <div className='post-user fw-bold pt-0'>
            <Placeholder animation='glow'>
             <Placeholder xs={2} size='sm' />
            </Placeholder>
          </div>
          <div style={{marginTop: '-.5rem'}} className='post-timestamp'>
            <Placeholder animation='glow'>
             <Placeholder xs={1} size='sm' />
            </Placeholder>
          </div>
        </Col>
      </Row>
      <br /><br /><br /><br /><br />
      <Row className='mt-1 mb-1'>
        <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
          <Placeholder animation='glow' className='fs-4 pb-1'>
             <Placeholder xs={4} size='xs' />
          </Placeholder>
        </Col>
        <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
          <Placeholder animation='glow' className='fs-4 pb-1'>
             <Placeholder xs={4} size='xs' />
          </Placeholder>
        </Col>
        <Col className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted'>
          <Placeholder animation='glow' className='fs-4 pb-1'>
             <Placeholder xs={4} size='xs' />
          </Placeholder>
        </Col>
    </Row>
    </Card.Body>
  </Card>
  );
};

export default PostPlaceholder;