import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, CloseButton, Row, Col } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';

const CardRecipeThumb = ({ recipe, count, isClickable, onClick }) => {
  return (
    <Card
      className={'text-body text-decoration-none user-select-none' + (isClickable ? ' cursor-pointer' : '')} 
      style={{overflow: 'hidden', position: 'relative', background: count > 0 ?  'lightgray' : 'transparent'}}
      onClick={() => isClickable ? onClick(recipe) : null}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : ''),
        opacity: count > 0 ? '.6' : '1',
        borderRadius: 0
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
  count: 0,
  isClickable: false,
};

const PostRecipesPreviewClear = ({ onClick }) => {
  return (
    <div style={{position: 'absolute', zIndex: 9999, display: 'block', right: 0}} className='post-recipes-preview-option m-2'>
      <div style={{position: 'relative'}}>
        <FaTimesCircle className='fs-1 cursor-pointer' color='gray' style={{position: 'absolute', top: '1px', right: '1px'}} />
        <FaTimesCircle className='fs-1 cursor-pointer' color='white' onClick={() => onClick()} style={{position: 'absolute', top: 0, right: 0}} />
      </div>
    </div>
  );
};

const PostRecipesPreviewEditButton = ({ onClick }) => {
  return (
    <div style={{position: 'absolute', zIndex: 9999, display: 'block'}}>
      <Button variant='primary' className='m-2' onClick={onClick}>Edit Captions</Button>
    </div>
  );
};

const PostRecipesPreviewEditWrapper = ({ children, onClear, onEditCaption }) => {
  return (
    <div style={{position: 'relative'}}>
      <PostRecipesPreviewClear onClick={onClear} />
      <PostRecipesPreviewEditButton onClick={onEditCaption} />
      {children}
    </div>
  );
};

const PostRecipesPreviewDisplayWrapper = ({ children }) => {
  return (
    <div style={{position: 'relative', marginLeft: '-1rem', marginRight: '-1rem'}}>
      {children}
    </div>
  );
};

const PostRecipesPreviewThumbnails = ({ recipes, isClickable, onClick }) => {
  let classNamesTopRow = recipes.length > 0 ? 'mt-3 g-0' : '';
  let classNamesBtmRow = recipes.length > 0 ? 'g-0' : '';
  if (recipes.length == 1) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  }
  else if (recipes.length == 2) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  }
  else if (recipes.length == 3) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  }
  else if (recipes.length == 4) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  }
  else if (recipes.length == 5) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[4]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  }
  else if (recipes.length > 5) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={onClick} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[4]} count={recipes.length-5} isClickable={isClickable} onClick={onClick} />
          </Col>
        </Row>
      </>
    );
  };
};

PostRecipesPreviewThumbnails.defaultProps = {
  isClickable: false,
};

const PostRecipesPreview = ({ recipes, onClearRecipes, onEditCaption, isFilterDeleted }) => {
  if (recipes.length >= 1) {
    if (isFilterDeleted) {
      recipes = recipes.filter(r => !r.hasOwnProperty('deleted') || r.deleted == false);
    }
    return (
      <PostRecipesPreviewEditWrapper onClear={onClearRecipes} onEditCaption={onEditCaption}>
        <PostRecipesPreviewThumbnails recipes={recipes} />
      </PostRecipesPreviewEditWrapper>
    );
  }
  else {
    return <></>;
  }
};

PostRecipesPreview.defaultProps = {
  isFilterDeleted: false,
};

const PostRecipesPreviewDisplay = ({ recipes, onClick }) => {
  if (recipes.length >= 1) {
    return (
      <PostRecipesPreviewDisplayWrapper>
        <PostRecipesPreviewThumbnails recipes={recipes} isClickable={true} onClick={onClick} />
      </PostRecipesPreviewDisplayWrapper>
    );
  }
  else {
    return <></>;
  }
};

export default PostRecipesPreview;
export { PostRecipesPreviewDisplay };