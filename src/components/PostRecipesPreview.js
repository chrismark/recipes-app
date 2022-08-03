import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Row, Col, Stack, Fade } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';

const CardRecipeThumb = ({ recipe, count }) => {
  return (
    <Card
      className='text-body text-decoration-none user-select-none' 
      style={{overflow: 'hidden', position: 'relative', background: count > 0 ?  'gray' : 'transparent'}}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : ''),
        opacity: count > 0 ? '.6' : '1'
      }} />
      {count > 0 && (
        <Card.Body style={{position: 'absolute', width: '100%', height: '100%'}} className='text-center text-white p-0 m-0 d-flex align-items-center justify-content-center'>
          <div className='font-weight-bolder' style={{fontSize: '3em', }}>+{count}</div>    
        </Card.Body>
      )}
    </Card>
  );
};

CardRecipeThumb.defaultProps = {
  count: 0
};

const PostRecipesPreviewWrapper = ({ children, recipes, onClear }) => {
  let classNames = recipes.length > 0 ? 'mt-3 g-0' : '';

  return (
    <div 
      style={{position: 'relative'}} 
    >
      <div style={{position: 'absolute', zIndex: 9999, display: 'block', width: '100%', textAlign: 'right'}} className='post-recipes-preview-options p-2'>
        <div style={{position: 'relative'}}>
          <FaTimesCircle className='fs-1 cursor-pointer' color='gray' style={{position: 'absolute', top: '1px', right: '1px'}} />
          <FaTimesCircle className='fs-1 cursor-pointer' color='white' onClick={() => onClear()} style={{position: 'absolute', top: 0, right: 0}} />
        </div>
      </div>
      <Row className={classNames}>
        {children}
      </Row>
    </div>
  );
};

const PostRecipesPreviewThumbnails = ({ recipes }) => {
  if (recipes.length == 1) {
    return (
      <>
        <Col>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
      </>
    );
  }
  else if (recipes.length == 2) {
    return (
      <>
        <Col>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
      </>
    );
  }
  else if (recipes.length == 3) {
    return (
      <>
        <Col md='12'>
          <CardRecipeThumb recipe={recipes[0]} />
        </Col>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[1]} />
        </Col>
        <Col md='6'>
          <CardRecipeThumb recipe={recipes[2]} />
        </Col>
      </>
    );
  }
  else if (recipes.length == 4) {
    return (
      <>
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
      </>
    );
  }
  else if (recipes.length == 5) {
    return (
      <>
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
      </>
    );
  }
  else if (recipes.length > 5) {
    return (
      <>
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
          <CardRecipeThumb recipe={recipes[4]} count={recipes.length-5} />
        </Col>
      </>
    );
  };
};

const PostRecipesPreview = ({ recipes, onClearRecipes }) => {
  if (recipes.length >= 1) {
    return (
      <PostRecipesPreviewWrapper recipes={recipes} onClear={onClearRecipes}>
        <PostRecipesPreviewThumbnails recipes={recipes} />
      </PostRecipesPreviewWrapper>
    );
  }
  else {
    return <></>;
  }
};

export default PostRecipesPreview;