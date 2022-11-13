export const SWAPI_BASE_URL = 'https://swapi.dev/api/';

export const routeParamToProductUrl = (routeParam: string) => {
  return SWAPI_BASE_URL + routeParam.replace('-', '/') + '/';
};
