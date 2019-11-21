import { RETRIEVE_DATA } from "../actionTypes";

const initialState = {
    estimated_yield : 0,
    estimated_tons  : 0,
    sugar_content   : 0,
    revenue         : 0,
    type_clustering : {"sample_type1":2, "sample_type2":1},
    days_elapsed_list: [1,2,3,4,5,6,7,8,9,10],
    predicted_yield_list: [1,2,4,8,16,32,64,128,256,512],
    date_list       : [1,2,3,4,5,6,7,8,9,10],
    mean_ndvi_list  : [0.5,0.6,0.65,0.69,0.73,0.72,0.71,0.8,0.84,0.7,]
};

const retrieveData = (state = initialState, action) => {
  switch (action.type) {
    case RETRIEVE_DATA: {
      const {estimated_yield,
        estimated_tons ,
        sugar_content,
        revenue       ,
        type_clustering ,
        days_elapsed_list ,
        predicted_yield_list ,
        date_list       ,
        mean_ndvi_list  } = action.payload;
      return {
        ...state,
        estimated_yield :estimated_yield,
        estimated_tons :estimated_tons,
        sugar_content:sugar_content,
        revenue  :revenue     ,
        type_clustering:type_clustering ,
        days_elapsed_list:days_elapsed_list ,
        predicted_yield_list:predicted_yield_list,
        date_list:date_list       ,
        mean_ndvi_list  :mean_ndvi_list
      }
    }
    default: {
      return state;
    }
  }
};

export default retrieveData;
