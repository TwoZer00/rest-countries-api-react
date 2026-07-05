import { useContext } from "react";
import { DataContext } from "../App";
import { unMemberFilter } from "../utils";

export function useCountryData() {
  return unMemberFilter(useContext(DataContext));
}
