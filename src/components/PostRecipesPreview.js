import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const CardRecipeThumb = ({ recipe }) => {
  return (
    <Card
      className='text-body text-decoration-none' 
      style={{overflow: 'hidden', position: 'relative'}}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : '')
      }} />
    </Card>
  );
};

const SingleImagePreview = ({ recipe }) => {
  return 
};

const PostRecipesPreview = ({ recipes }) => {
  let classNames = recipes.length > 0 ? 'mt-3 g-0' : '';
  if (recipes.length == 1) {
    return (
      <Row className={classNames}>
        <Col>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
      </Row>
    );
  }
  else if (recipes.length == 2) {
    return (
      <Row className={classNames}>
        <Col>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
      </Row>
    );
  }
  else if (recipes.length == 3) {
    return (
      <Row className={classNames}>
        <Col md='12'>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[2]} />
        </Col>
      </Row>
    );
  }
  else if (recipes.length == 4) {
    return (
      <Row className={classNames}>
        <Col md='12'>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[2]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[3]} />
        </Col>
      </Row>
    );
  }
  else if (recipes.length == 5) {
    return (
      <Row className={classNames}>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[2]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[3]} />
        </Col>
        <Col md='4'>
          <CardRecipeThumb recipe={recipes[4]} />
        </Col>
      </Row>
    );
  }
  return (<>

  </>);
};

export default PostRecipesPreview;