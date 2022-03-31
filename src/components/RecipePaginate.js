import { useEffect, useState } from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';

const RecipePaginate = ({ recipes, recipeCount, pageOffset, size, onFirstPage, onPrevPage, onNextPage, onLastPage }) => {
  const [enableFirstPageLink, setEnableFirstPageLink] = useState(false);
  const [enablePrevPageLink, setEnablePrevPageLink] = useState(false);
  const [enableNextPageLink, setEnableNextPageLink] = useState(false);
  const [enableLastPageLink, setEnableLastPageLink] = useState(false);

  const determinePageLinkAbleness = () => {
    const isFirstPageLinkEnabled = !(pageOffset > 0);
    const isOtherPageLinkEnabled = !( recipeCount - (size * (pageOffset + 1)) );
    setEnableFirstPageLink(isFirstPageLinkEnabled);
    setEnablePrevPageLink(isFirstPageLinkEnabled);
    setEnableNextPageLink(isOtherPageLinkEnabled);
    setEnableLastPageLink(isOtherPageLinkEnabled);
  };

  useEffect(() => {
    determinePageLinkAbleness();
  }, [recipes]);

  return (
    <Row className='justify-content-md-center'>
      <Col md='auto'>
        <br/><br/>
        <Pagination>
          <Pagination.First disabled={enableFirstPageLink} onClick={() => onFirstPage()}>First</Pagination.First>
          <Pagination.Prev disabled={enablePrevPageLink} onClick={() => onPrevPage()}>Prev</Pagination.Prev>
          <Pagination.Next disabled={enableNextPageLink} onClick={() => onNextPage()}>Next</Pagination.Next>
          <Pagination.Last disabled={enableLastPageLink} onClick={() => onLastPage()}>Last</Pagination.Last>
        </Pagination>
      </Col>
    </Row>
  );
};

export default RecipePaginate;