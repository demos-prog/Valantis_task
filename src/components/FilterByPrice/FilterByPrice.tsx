import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import css from "./FilterByPrice.module.css";

type t = {
  getFields: (action: string, params: unknown) => Promise<Response | undefined>;
  setIDs: Dispatch<SetStateAction<never[]>>;
  isLoading: boolean;
};

const FilterByPrice: React.FC<t> = ({ getFields, setIDs, isLoading }) => {
  const [inpValue, setinpValue] = useState<number>(0);

  const handleChangeInput:
    | ChangeEventHandler<HTMLInputElement>
    | undefined = (e: { target: { value: SetStateAction<string> } }) => {
    const price = +e.target.value;
    if (price > 0) {
      setinpValue(+e.target.value);
    }
  };

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    getFields("filter", { price: inpValue }).then(async (res) => {
      const d = await res?.json();
      const IDs = d.result;

      if (IDs.length >= 0) {
        setIDs(IDs);
      } else {
        alert("Nothing was found");
      }
    });
  };

  return (
    <form className={css.form} onSubmit={handleSearch}>
      <input
      disabled={isLoading}
        type="number"
        name=""
        className={css.inp}
        title="nameInput"
        value={inpValue}
        onChange={handleChangeInput}
      />
      <button disabled={isLoading} id={css.btn} type="submit">
        Filter by Price
      </button>
    </form>
  );
};

export default FilterByPrice;
