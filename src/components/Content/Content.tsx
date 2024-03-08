import { useCallback, useEffect, useState } from "react";
import md5 from "md5";
import Product, { ProductType } from "../Product/Product.tsx";
import css from "./Content.module.css";

type ContentProps = {
  offset: number;
  setIsLoading: (value: boolean) => void;
};

const Content: React.FC<ContentProps> = ({ offset, setIsLoading }) => {
  const [IDs, setIDs] = useState([]);
  const [data, setData] = useState([]);

  const getData = useCallback(
    async (action: string, params: unknown) => {
      setIsLoading(true);
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const response = await fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${timestamp}`),
        },
        body: JSON.stringify({
          action: action,
          params: params,
        }),
      });
      return response;
    },
    [setIsLoading]
  );

  useEffect(() => {
    getData("get_ids", { offset: offset, limit: 50 })
      .then(async (res) => {
        const d = await res.json();
        setIDs(d.result);
      })
      .then(() => {
        getData("get_items", { ids: IDs }).then(async (res) => {
          const d = await res.json();
          setData(d.result);
          setIsLoading(false);
        });
      });
  }, [IDs, getData, offset, setIsLoading]);

  console.log(data);

  return (
    <div id={css.wrap}>
      {data?.map((product: ProductType, i: number) => {
        return (
          <Product
            brand={product.brand}
            id={product.id}
            price={product.price}
            product={product.product}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default Content;
