import React from "react";
import css from "./Product.module.css";

export type ProductType = {
  brand: string | null;
  id: string;
  price: number;
  product: string;
};

const Product: React.FC<ProductType> = ({ brand, id, price, product }) => {
  return (
    <div className={css.productWrap}>
      <h3>{product}</h3>
      <span>{brand}</span>
      <span>{price}</span>
      <span>{id}</span>
    </div>
  );
};

export default Product;
