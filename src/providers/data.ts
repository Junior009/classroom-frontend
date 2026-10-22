import {
  createDataProvider,
  type CreateDataProviderOptions,
} from "@refinedev/rest";
import { BACKEND_BASE_URL } from "../components/constants";
import type { ListResponse, CreateResponse, GetOneResponse } from "@/types";
import { HttpError } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  throw new Error("Missing environment variable: VITE_BACKEND_BASE_URL");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed.';

  try{
    const payload = (await response.json()) as { message?: string }

    if(payload?.message) message = payload.message;
  } catch {
    // Ignore errors
  }

  return {
    message,
    statusCode: response.status
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ pagination, filters, resource }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';

        const value = String(filter.value);

          if(resource === 'subjects') {
            if (field === 'department') params.department = value;
            if(field === 'name' || field === 'code') params.search = value;
          }
        })

        return params;
    },

    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create:{
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables}) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json.data ?? [];
    }
  },

  getOne: {
    getEndpoint: ({resource, id}) => `${resource}/${id}`,
    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? [];
    }
  },

  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    getRequestMethod: () => "put",
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json: CreateResponse = await response.json();
      return json.data;
    },
  }
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };