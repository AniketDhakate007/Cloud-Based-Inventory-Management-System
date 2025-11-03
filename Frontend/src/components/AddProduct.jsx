import { useState } from "react";

export default function AddProduct({ onAdd }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (name && stock) {
      onAdd(name, parseInt(stock));
      setName("");
      setStock("");
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4 items-end"
    >
      <div>
        <label className="block font-medium mb-1">Product Name</label>
        <input
          type="text"
          className="border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Stock</label>
        <input
          type="number"
          className="border rounded p-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add
      </button>
    </form>
  );
}
