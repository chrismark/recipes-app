import { useEffect, useState, useRef, useCallback } from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 500;

const SimplePaginate = ({ onPage, page }) => {
  console.log('Render SimplePaginate: ', page);

  const onClickPrev = debounce((e) => {
    e.preventDefault();
    onPage(Math.max(0, page - 1));
  }, DEBOUNCE_DELAY);

  const onClickNext = debounce((e) => {
      e.preventDefault();
      onPage(page + 1);
    }, DEBOUNCE_DELAY);

  return (
    <Row className='justify-content-md-center m-auto'>
      <Col md='auto'>
        <Pagination>
          <Pagination.Prev onClick={onClickPrev}>Prev</Pagination.Prev>
          <Pagination.Next onClick={onClickNext}>Next</Pagination.Next>
        </Pagination>
      </Col>
    </Row>
  );
};

export default SimplePaginate;