import { UsersDBViewModel } from "./UsersDBViewModel";

export interface UsersViewModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersDBViewModel[];
}
