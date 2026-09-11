import Button from "../../../../components/common/Button";

type DeleteDishModalProps = {
  dishName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteDishModal = ({
  dishName,
  onClose,
  onConfirm,
}: DeleteDishModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-xl bg-base-100 p-5 sm:p-6 shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold">
          Delete Dish
        </h2>

        <p className="mt-3 text-xs sm:text-sm opacity-70">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-base-content">
            {dishName}
          </span>
          ?
        </p>

        <p className="mt-2 text-xs sm:text-sm text-error">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            className="w-full sm:w-auto"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDishModal;