import { SET_CORS } from "../actionTypes";

const initialState = {
    lon:0,
    lat:0,
    poly: []
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
    default: {
      return state;
    }
  }
};

export default mapcor;
