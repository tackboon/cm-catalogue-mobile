import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./user/user.reducer";
import { dataReducer } from "./data/data.reducer";
import { categoryReducer } from "./category/category.reducer";
import { productReducer } from "./product/product.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  data: dataReducer,
  category: categoryReducer,
  product: productReducer,
});
