import { useState } from "react";

function ReturnDamageHandling() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ item: "", reason: "", type: "return" });


  const handleSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, { ...form, id: Date.now() }]);
    setForm({ item: "", reason: "", type: "return" });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-xl">
      <h2 className="text-xl font-bold mb-4">Return & Damage Handling</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="return">Return</option>
          <option value="damage">Damage</option>
        </select>
        <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Submit
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Reported Items</h3>
        <ul className="space-y-2">
          {reports.map((report) => (
            <li
              key={report.id}
              className="p-3 border rounded-lg flex justify-between bg-gray-100"
            >
              <span>{report.item} - {report.type.toUpperCase()}</span>
              <span className="text-gray-600">{report.reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ReturnDamageHandling;

