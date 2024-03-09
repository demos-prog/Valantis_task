import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import md5 from "md5";
import Product, { ProductType } from "../Product/Product.tsx";
import loader from "../../assets/Eclipse-1s-200px.svg";
import css from "./Content.module.css";

type ContentProps = {
  offset: number;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  IDs: string[];
  setIDs: Dispatch<SetStateAction<never[]>>;
};

const Content: React.FC<ContentProps> = ({
  IDs,
  setIDs,
  offset,
  isLoading,
  setIsLoading,
}) => {
  const [data, setData] = useState([]);

  const getData = useCallback(
    async (action: string, params: unknown) => {
      setIsLoading(true);
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

      try {
        const response = await fetch("http://api.valantis.store:40000/", {
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
      } catch (error) {
        console.log("There was an error", error);
      }
    },
    [setIsLoading]
  );

  useEffect(() => {
    getData("get_ids", { offset: offset, limit: 50 }).then(async (res) => {
      const d = await res?.json();
      setIDs(d.result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    getData("get_items", { ids: IDs }).then(async (res) => {
      const d = await res?.json();
      setData(d.result);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDs]);

  return (
    <>
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
        {isLoading && (
          <div id={css.loadWrap}>
            <img id={css.img} src={loader} alt="loader" />
          </div>
        )}
      </div>
    </>
  );
};

export default Content;
