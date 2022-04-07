import { useEffect, useState } from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';

const Paginate = ({ dataSource, totalCount, pageOffset, size, onPage }) => {
  const [enableFirstPageLink, setEnableFirstPageLink] = useState(false);
  const [enablePrevPageLink, setEnablePrevPageLink] = useState(false);
  const [enableNextPageLink, setEnableNextPageLink] = useState(false);
  const [enableLastPageLink, setEnableLastPageLink] = useState(false);
  const [leftPages, setLeftPages] = useState([]);
  const [rightPages, setRightPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  /**
   * << < [1] 2 3 4 5 ... 11 > >>
   * << < 1 [2] 3 4 5 ... 11 > >>
   * << < 1 2 [3] 4 5 ... 11 > >>
   * << < 1 2 3 [4] 5 6 ... 11 > >>
   * << < 1 ... 3 4 [5] 6 7 ... 11 > >>
   * << < 1 ... 4 5 [6] 7 8 ... 11 > >>
   * << < 1 ... 5 6 [7] 8 9 ... 11 > >>
   * << < 1 ... 6 7 [8] 9 10 11 > >>
   */
  const updatePageLinks = () => {
    const lastPage = Math.ceil(totalCount / size);
    const curPage = Math.max(1, (pageOffset / size) + 1);
    let leftPages = [];
    let rightPages = [];
    
    console.log('lastPage: ', lastPage);
    console.log('curPage: ', curPage);

    // generate pages left of current page
    let n = curPage - 1;
    let i = Math.max(1, curPage - 2);
    if (i == 2) {
      leftPages.push(1);
    }
    else if (i > 2) {
      leftPages.push(1);
      leftPages.push('...');
    }
    for (; i <= n; i++) {
      leftPages.push(i);
    }
    console.log('leftPages: ', leftPages.join(','));

    // generate pages right of current page
    i = curPage + 1;
    n = Math.min(lastPage, curPage + 2);
    if (n < 5) {
      n = 5;
    }
    for (; i <= n; i++) {
      rightPages.push(i);
    }
    if (n <= lastPage - 2) {
      rightPages.push('...');
      rightPages.push(lastPage);
    }
    else if (n === lastPage - 1) {
      rightPages.push(lastPage);
    }
    console.log('rightPages: ', rightPages.join(','));

    setCurrentPage(curPage);
    setLastPage(lastPage);
    setLeftPages(leftPages);
    setRightPages(rightPages);

    const isFirstPageLinkEnabled = !(curPage > 1);
    const isOtherPageLinkEnabled = !(curPage < lastPage);
    setEnableFirstPageLink(isFirstPageLinkEnabled);
    setEnablePrevPageLink(isFirstPageLinkEnabled);
    setEnableNextPageLink(isOtherPageLinkEnabled);
    setEnableLastPageLink(isOtherPageLinkEnabled);
  };

  useEffect(() => {
    updatePageLinks();
  }, [dataSource]);

  return (
    <Row className='justify-content-md-center'>
      <Col md='auto'>
        <Pagination>
          <Pagination.First disabled={enableFirstPageLink} onClick={() => onPage(1)}>First</Pagination.First>
          <Pagination.Prev disabled={enablePrevPageLink} onClick={() => onPage(currentPage - 1)}>Prev</Pagination.Prev>
          {leftPages.map(page => (
            page === '...' 
              ? <Pagination.Item disabled>{page}</Pagination.Item>
              : <Pagination.Item onClick={() => onPage(page)}>{page}</Pagination.Item>
          ))}
          <Pagination.Item active>{currentPage}</Pagination.Item>
          {rightPages.map(page => (
            page === '...' 
              ? <Pagination.Item disabled>{page}</Pagination.Item>
              : <Pagination.Item onClick={() => onPage(page)}>{page}</Pagination.Item>
          ))}
          <Pagination.Next disabled={enableNextPageLink} onClick={() => onPage(currentPage + 1)}>Next</Pagination.Next>
          <Pagination.Last disabled={enableLastPageLink} onClick={() => onPage(lastPage)}>Last</Pagination.Last>
        </Pagination>
      </Col>
    </Row>
  );
};

export default Paginate;