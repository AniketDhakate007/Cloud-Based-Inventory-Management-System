export default function ProductList({ products }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-3">Product List</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td
                  className={`p-2 font-medium ${
                    p.stock < 5 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  