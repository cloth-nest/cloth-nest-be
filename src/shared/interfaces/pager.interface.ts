export interface PagerInformation {
  limit: number;
  offset: number;
  currentPageNum: number;
  totalCount: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPageNum?: number;
  nextPageNum?: number;
  lastPageNum: number;
}
