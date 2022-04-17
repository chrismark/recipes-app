import { Image, Modal, Row, Col, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SaveRecipeModal = ({ recipesToSave, recipesSaved, show, isSavingRecipe, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size='lg' xs={1} backdrop='static' centered>
      <Modal.Body>
        <br />        
        {isSavingRecipe && (<>
          <h4 className='text-center'>
            Saving {recipesToSave.length} recipe(s)...
            <Spinner animation="border" role="status" style={{marginLeft: '1vw', verticalAlign: 'middle'}}>
              <span className="visually-hidden">Saving...</span>
            </Spinner>
          </h4>
          <br />
          <Row className='justify-content-md-center'>      
            <Col md={8}>
              <Row>
                {recipesToSave.map(recipe => (
                  <Col xs={12} key={recipe.id}>
                    <ListGroup horizontal>
                      <ListGroupItem style={{border: 0, width: '10vw'}}>
                        <Image src={recipe.thumbnail_url} fluid />
                      </ListGroupItem>
                      <ListGroupItem style={{border: 0}}>
                        <h5>{recipe.name}</h5>
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </>)}
        {!isSavingRecipe && (<>
          {recipesSaved.length > 0 ? (<>
            <h4 className='text-center'>{recipesSaved.length} new recipe(s) added to <span className='fw-bolder'>Saved Recipes</span>. <Link className='fw-normal' to='#' onClick={onClose}>Close</Link></h4>
            <br/>
            <Row className='justify-content-md-center'>
              <Col md={8}>
                <Row>
                  {recipesSaved.map(recipe => (
                    <Col md='auto' key={recipe.id}>
                      <ListGroup horizontal>
                        <ListGroupItem style={{border: 0, width: '10vw'}}>
                          <Image src={recipe.thumbnail_url} fluid />
                        </ListGroupItem>
                        <ListGroupItem style={{border: 0}}>
                          <h5>{recipe.name}</h5>
                        </ListGroupItem>
                      </ListGroup>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </>)
          : (<>
            <h4 className='text-center'>Recipe(s) already added to <span className='fw-bolder'>Saved Recipes</span>. <Link className='fw-normal' to='#' onClick={onClose}>Close</Link></h4>
          </>)}
        </>)}
        <br/>
      </Modal.Body>
    </Modal>
  );
};

export default SaveRecipeModal;