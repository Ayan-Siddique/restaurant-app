import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMode } from "../../store/slices/themeSlice";

function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-1.5 sm:gap-2">
      <button
        type="button"
        className={`btn btn-xs sm:btn-sm ${mode === "all" ? "btn-neutral" : "btn-outline"}`}
        onClick={() => dispatch(setMode("all"))}
      >
        All
      </button>

      <button
        type="button"
        className={`btn btn-xs sm:btn-sm ${
          mode === "veg" ? "bg-green-500 text-white" : "btn-outline"
        }`}
        onClick={() => dispatch(setMode("veg"))}
      >
        Veg
      </button>

      <button
        type="button"
        className={`btn btn-xs sm:btn-sm ${
          mode === "nonVeg" ? "bg-red-500 text-white" : "btn-outline"
        }`}
        onClick={() => dispatch(setMode("nonVeg"))}
      >
        Non-Veg
      </button>
    </div>
  );
}

export default ThemeToggle;