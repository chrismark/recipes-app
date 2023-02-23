import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, CloseButton, Row, Col } from 'react-bootstrap';
import { BsXCircleFill } from 'react-icons/bs';

const CardRecipeThumb = ({ recipe, count, isClickable, onClick }) => {
  return (
    <Card
      className={'text-body text-decoration-none user-select-none' + (isClickable ? ' cursor-pointer' : '')} 
      style={{overflow: 'hidden', position: 'relative', background: count > 0 ?  'lightgray' : 'transparent'}}
      onClick={() => isClickable ? onClick(recipe) : null}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
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
        <BsXCircleFill className='fs-1 cursor-pointer' color='gray' style={{position: 'absolute', top: '1px', right: '1px'}} />
        <BsXCircleFill className='fs-1 cursor-pointer' color='white' onClick={() => onClick()} style={{position: 'absolute', top: 0, right: 0}} />
      </div>
    </div>
  );
};

const PostRecipesPreviewEditButton = ({ onClick, disabled }) => {
  return (
    <div style={{position: 'absolute', zIndex: 9999, display: 'block'}}>
      <Button variant={disabled ? 'secondary' : 'primary'} className='m-2' onClick={onClick} disabled={disabled}>Edit Captions</Button>
    </div>
  );
};

PostRecipesPreviewEditButton.defaultProps = {
  disabled: false,
};

// Only allow edit caption if there's more than 1 selected recipe
const PostRecipesPreviewEditWrapper = ({ children, onClear, onEditCaption, disableEditButton, hideEditButton }) => {
  return (
    <div style={{position: 'relative'}}>
      {!disableEditButton && <PostRecipesPreviewClear onClick={onClear} />}
      {!hideEditButton && <PostRecipesPreviewEditButton onClick={onEditCaption} disabled={disableEditButton} />}
      {children}
    </div>
  );
};

PostRecipesPreviewEditWrapper.defaultProps = {
  disableEditButton: false,
  hideEditButton: false,
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
  const createHandler = (handler, index) => {
    return (recipe) => handler(index, recipe);
  };

  if (recipes.length == 1) {
    return (
      <>
        <Row className={classNamesTopRow}>
          <Col className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
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
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={createHandler(onClick, 1)} />
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
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={createHandler(onClick, 1)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={createHandler(onClick, 2)} />
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
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={createHandler(onClick, 1)} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={createHandler(onClick, 2)} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={createHandler(onClick, 3)} />
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
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={createHandler(onClick, 1)} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={createHandler(onClick, 2)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={createHandler(onClick, 3)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[4]} isClickable={isClickable} onClick={createHandler(onClick, 4)} />
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
            <CardRecipeThumb recipe={recipes[0]} isClickable={isClickable} onClick={createHandler(onClick, 0)} />
          </Col>
          <Col xs='6' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[1]} isClickable={isClickable} onClick={createHandler(onClick, 1)} />
          </Col>
        </Row>
        <Row className={classNamesBtmRow}>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[2]} isClickable={isClickable} onClick={createHandler(onClick, 2)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[3]} isClickable={isClickable} onClick={createHandler(onClick, 3)} />
          </Col>
          <Col xs='4' className='d-flex justify-content-center'>
            <CardRecipeThumb recipe={recipes[4]} count={recipes.length-5} isClickable={isClickable} onClick={createHandler(onClick, 4)} />
          </Col>
        </Row>
      </>
    );
  };
};

PostRecipesPreviewThumbnails.defaultProps = {
  isClickable: false,
};

const PostRecipesPreview = ({ disableEditButton, recipes, onClearRecipes, onEditCaption, isFilterDeleted }) => {
  if (recipes.length >= 1) {
    if (isFilterDeleted) {
      recipes = recipes.filter(r => !r.hasOwnProperty('deleted') || r.deleted == false);
    }
    return (
      <div className='post-recipes-preview'>
        <PostRecipesPreviewEditWrapper onClear={onClearRecipes} onEditCaption={onEditCaption} disableEditButton={disableEditButton} hideEditButton={recipes.length == 1}>
          <PostRecipesPreviewThumbnails recipes={recipes} />
        </PostRecipesPreviewEditWrapper>
      </div>
    );
  }
  else {
    return <></>;
  }
};

PostRecipesPreview.defaultProps = {
  isFilterDeleted: false,
  disableEditButton: false,
};

const PostRecipesPreviewDisplay = ({ recipes, onClick }) => {
  if (recipes.length >= 1) {
    return (
      <div className='post-recipes-preview-display'>
        <PostRecipesPreviewDisplayWrapper>
          <PostRecipesPreviewThumbnails recipes={recipes} isClickable={true} onClick={onClick} />
        </PostRecipesPreviewDisplayWrapper>
      </div>
    );
  }
  else {
    return <></>;
  }
};

export default PostRecipesPreview;
export { PostRecipesPreviewDisplay };