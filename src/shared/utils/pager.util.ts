import { PagerInformation } from '../interfaces';

export const paginate = (
  limit: number,
  page: number,
  totalCount: number,
): PagerInformation => {
  const totalPage = limit !== 0 ? Math.ceil(totalCount / limit) : 1;
  const currentPageNum = page > totalPage ? totalPage : page;
  const hasPrevPage = currentPageNum > 1;
  const hasNextPage = currentPageNum < totalPage;
  const offset = currentPageNum > 0 ? limit * (currentPageNum - 1) : 0;

  return {
    limit,
    offset,
    currentPageNum,
    totalCount,
    hasPrevPage,
    hasNextPage,
    prevPageNum: hasPrevPage ? currentPageNum - 1 : undefined,
    nextPageNum: hasNextPage ? currentPageNum + 1 : undefined,
    lastPageNum: totalPage,
  };
};
