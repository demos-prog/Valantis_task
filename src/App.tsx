import React, { Suspense, useState } from "react";
import css from "./App.module.css";

const LazyContent = React.lazy(
  () => import("./components/Content/Content.tsx")
);

function App() {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
      <header>
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
      </header>
      <Suspense fallback={"Loading..."}>
        <LazyContent
          offset={offset}
          setOffset={setOffset}
          setIsLoading={setIsLoading}
        />
      </Suspense>
    </>
  );
}

export default App;
