import React, { Suspense, useCallback, useState } from "react";
import md5 from "md5";
import FilterByName from "./components/FilterByName/FilterByName.tsx";
import FilterByPrice from "./components/FilterByPrice/FilterByPrice.tsx";
import FilerByBrand from "./components/FilerByBrand/FilerByBrand.tsx";
import css from "./App.module.css";

const LazyContent = React.lazy(
  () => import("./components/Content/Content.tsx")
);

const URL = "https://api.valantis.store:41000/";

function App() {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [IDs, setIDs] = useState([]);

  const getFields = useCallback(async (action: string, params: unknown) => {
    setIsLoading(true);
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    try {
      const response = await fetch(URL, {
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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      console.log("There was an error", error);
    }
  }, []);

  const nextPage = () => {
    setOffset((prev) => prev + 50);
  };

  const handlePrev = () => {
    if (offset >= 50) {
      setOffset((prev) => prev - 50);
    }
  };

  const isDisabledPrev = offset < 50 || isLoading;

  return (
    <>
      <div id={css.head}>
        <div id={css.paginWr}>
          <button
            disabled={isDisabledPrev}
            className={isDisabledPrev ? css.disabledBtn : css.activeBtn}
            type="button"
            onClick={handlePrev}
          >
            Prev
          </button>
          <span>Page {offset / 50 + 1}</span>
          <button
            disabled={isLoading}
            className={isLoading ? css.disabledBtn : css.activeBtn}
            type="button"
            onClick={nextPage}
          >
            Next
          </button>
        </div>

        <div id={css.filters}>
          <FilterByName isLoading={isLoading} getFields={getFields} setIDs={setIDs} />
          <FilterByPrice isLoading={isLoading} getFields={getFields} setIDs={setIDs} />
          <FilerByBrand isLoading={isLoading} getFields={getFields} setIDs={setIDs} />
        </div>
      </div>
      <Suspense fallback={"Loading..."}>
        <LazyContent
          IDs={IDs}
          setIDs={setIDs}
          offset={offset}
          URL={URL}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Suspense>
    </>
  );
}

export default App;
