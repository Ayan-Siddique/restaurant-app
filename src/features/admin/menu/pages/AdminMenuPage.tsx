import { useState } from "react";

import AdminPageHeader from "../../components/AdminPageHeader";
import Button from "../../../../components/common/Button";
import MenuFilters from "../components/MenuFilters";
import MenuTable from "../components/MenuTable";
import AddDishModal from "../components/AddDishModal";
import DeleteDishModal from "../components/DeleteDishModal";
import type { MenuItem } from "../../types";

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    available: true,
    isVeg: true,
  },
  {
    id: "2",
    name: "Classic Cheese Burger",
    category: "Burger",
    price: 249,
    available: true,
    isVeg: false,
  },
  {
    id: "3",
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    price: 299,
    available: false,
    isVeg: true,
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 180,
    available: true,
    isVeg: true,
  },
  {
    id: "5",
    name: "Paneer Tikka",
    category: "Starters",
    price: 220,
    available: true,
    isVeg: true,
  },
];

const AdminMenuPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(initialMenuItems);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [deletingDish, setDeletingDish] = useState<MenuItem | null>(null);

  const handleAvailabilityChange = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  const handleAddDish = (newDish: MenuItem) => {
  setItems((currentItems) => [...currentItems, newDish]);
  setIsAddDishOpen(false);
};

const handleEditDish = (dish: MenuItem) => {
  setEditingDish(dish);
};

const handleUpdateDish = (updatedDish: MenuItem) => {
  setItems((currentItems) =>
    currentItems.map((item) =>
      item.id === updatedDish.id ? updatedDish : item
    )
  );

  setEditingDish(null);
};

const handleDeleteDish = (id: string) => {
  const dish = items.find((item) => item.id === id);

  if (dish) {
    setDeletingDish(dish);
  }
};

const confirmDeleteDish = () => {
  if (!deletingDish) return;

  setItems((currentItems) =>
    currentItems.filter((item) => item.id !== deletingDish.id)
  );

  setDeletingDish(null);
};
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <AdminPageHeader
        title="Menu Management"
        description="Manage your restaurant dishes and their availability."
      >
        <Button
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => setIsAddDishOpen(true)}
        >
          + Add Dish
        </Button>
      </AdminPageHeader>

      <MenuFilters
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      <MenuTable
  items={filteredItems}
  onAvailabilityChange={handleAvailabilityChange}
  onEditDish={handleEditDish}
  onDeleteDish={handleDeleteDish}
/>

     {(isAddDishOpen || editingDish) && (
  <AddDishModal
    onClose={() => {
      setIsAddDishOpen(false);
      setEditingDish(null);
    }}
    onAddDish={handleAddDish}
    dish={editingDish}
    onUpdateDish={handleUpdateDish}
  />
)}

{deletingDish && (
  <DeleteDishModal
    dishName={deletingDish.name}
    onClose={() => setDeletingDish(null)}
    onConfirm={confirmDeleteDish}
  />
)}
    </div>
  );
};

export default AdminMenuPage;
