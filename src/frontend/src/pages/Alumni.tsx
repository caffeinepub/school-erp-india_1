export function Alumni() {
  const alumni = [
    {
      name: "Suresh Agarwal",
      batch: "2010-11",
      class: "Class 12",
      currentRole: "Software Engineer, TCS",
      contact: "suresh@email.com",
    },
    {
      name: "Meera Joshi",
      batch: "2012-13",
      class: "Class 12",
      currentRole: "Doctor, AIIMS Delhi",
      contact: "meera@email.com",
    },
    {
      name: "Rajan Patel",
      batch: "2015-16",
      class: "Class 12",
      currentRole: "CA, Deloitte",
      contact: "rajan@email.com",
    },
    {
      name: "Kavitha Nair",
      batch: "2018-19",
      class: "Class 12",
      currentRole: "Civil Services (IAS)",
      contact: "kavitha@email.com",
    },
    {
      name: "Amit Sharma",
      batch: "2020-21",
      class: "Class 12",
      currentRole: "Engineer, ISRO",
      contact: "amit@email.com",
    },
  ];

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Alumni</h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Total Alumni</p>
          <p className="text-white text-2xl font-bold">320</p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Batches</p>
          <p className="text-blue-400 text-2xl font-bold">15</p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Events This Year</p>
          <p className="text-green-400 text-2xl font-bold">2</p>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "#1a1f2e" }}>
              {["Name", "Batch", "Class", "Current Role", "Contact"].map(
                (h) => (
                  <th key={h} className="text-left px-3 py-2 text-gray-400">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {alumni.map((a, i) => (
              <tr
                key={a.name}
                style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
              >
                <td className="px-3 py-2 text-white font-medium">{a.name}</td>
                <td className="px-3 py-2 text-blue-400">{a.batch}</td>
                <td className="px-3 py-2 text-gray-300">{a.class}</td>
                <td className="px-3 py-2 text-gray-300">{a.currentRole}</td>
                <td className="px-3 py-2 text-gray-400">{a.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
