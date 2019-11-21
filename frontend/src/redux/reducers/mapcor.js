import { SET_CORS } from "../actionTypes";
import { OPEN_MODAL } from "../actionTypes";

const initialState = {
    lon:0,
    lat:0,
    poly: [],
    modal: false,
};

const mapcor = (state = initialState, action) => {
  switch (action.type) {
    case SET_CORS: {
      const { lon, lat, poly } = action.payload;
      return {
        lon: lon,
        lat: lat,
        poly: poly
      }
    }
    case OPEN_MODAL: {
      const { modal } = action.payload;
      return {
        ...state,
        modal: modal 
      }
    }
    default: {
      return state;
    }
  }
};

export default mapcor;
