import { SET_CORS } from "./actionTypes";
import { OPEN_MODAL, RETRIEVE_DATA} from "./actionTypes";

export const setCors = cors => ({
  type: SET_CORS,
  payload: {
      lon: cors.lon,
      lat: cors.lat,
      poly: cors.poly
  }
});

export const openModal = modal => ({
  type: OPEN_MODAL,
  payload: {
    modal: modal
  }
});


export const retrieveData = data => ({
  type: RETRIEVE_DATA,
  payload: data
});