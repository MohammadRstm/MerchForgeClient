import type {
    BusinessesQueryParams,
    SystemRoleFilter,
    UsersQueryParams,
    WebsiteTemplateRequestsQueryParams,
} from "./types";

export const DEFAULT_PAGE_SIZE = 10;

export const INITIAL_USERS_QUERY: UsersQueryParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "CreatedAt",
    sortDescending: true,
};

export const INITIAL_BUSINESSES_QUERY: BusinessesQueryParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "CreatedAt",
    sortDescending: true,
};

export const INITIAL_WEBSITE_TEMPLATE_REQUESTS_QUERY: WebsiteTemplateRequestsQueryParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortDescending: true,
};

export const SYSTEM_ROLE_FILTER_OPTIONS: SystemRoleFilter[] = ["User", "Admin", "SuperAdmin"];

export const SEARCH_DEBOUNCE_MS = 400;
