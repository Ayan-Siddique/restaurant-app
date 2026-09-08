import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMode } from "../../store/slices/themeSlice";

function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-1.5 sm:gap-2">
      

      <button
  type="button"
  className={`btn btn-xs sm:btn-sm ${
    mode === "veg"
      ? "bg-green-500 text-white"
      : "btn-outline"
  }`}
  onClick={() =>
    dispatch(setMode(mode === "veg" ? "all" : "veg"))
  }
>
  Veg
</button>

      
    </div>
  );
}

export default ThemeToggle;