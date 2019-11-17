import { SET_CORS } from "./actionTypes";


export const setCors = cors => ({
  type: SET_CORS,
  payload: {
      lon: cors.lon,
      lat: cors.lat,
      poly: cors.poly
  }
});

