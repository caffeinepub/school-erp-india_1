export function Certificate() {
  const students = [
    {
      name: "Aarav Sharma",
      admNo: "ADM-1001",
      class: "Class 5-A",
      dob: "12/03/2014",
    },
    {
      name: "Priya Patel",
      admNo: "ADM-1002",
      class: "Class 7-B",
      dob: "22/07/2012",
    },
    {
      name: "Rohit Kumar",
      admNo: "ADM-1003",
      class: "Class 10-A",
      dob: "05/01/2009",
    },
  ];

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">
        Certificate &amp; ID Card
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            title: "Transfer Certificate",
            desc: "Generate TC for leaving students",
            color: "#3b82f6",
          },
          {
            title: "Student Certificate",
            desc: "Bonafide & character certificates",
            color: "#22c55e",
          },
          {
            title: "Student ID Card",
            desc: "Generate photo ID cards",
            color: "#8b5cf6",
          },
          {
            title: "Staff ID Card",
            desc: "Staff identification cards",
            color: "#f97316",
          },
          { title: "Admit Card", desc: "Exam admit cards", color: "#14b8a6" },
          {
            title: "Marksheet",
            desc: "Print student marksheets",
            color: "#eab308",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-lg p-4 cursor-pointer hover:opacity-80 transition"
            style={{ background: "#1a1f2e", border: `1px solid ${c.color}44` }}
          >
            <h3 className="text-sm font-medium mb-1" style={{ color: c.color }}>
              {c.title}
            </h3>
            <p className="text-gray-500 text-xs">{c.desc}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-lg p-4 max-w-2xl"
        style={{ background: "#1a1f2e", border: "1px solid #374151" }}
      >
        <h3 className="text-white text-sm font-medium mb-3">
          Generate Transfer Certificate
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label
              htmlFor="cert-student"
              className="text-gray-400 text-xs block mb-1"
            >
              Select Student
            </label>
            <select
              id="cert-student"
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
            >
              {students.map((s) => (
                <option key={s.admNo}>
                  {s.name} ({s.admNo})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="cert-dol"
              className="text-gray-400 text-xs block mb-1"
            >
              Date of Leaving
            </label>
            <input
              id="cert-dol"
              type="date"
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="cert-reason"
              className="text-gray-400 text-xs block mb-1"
            >
              Reason for Leaving
            </label>
            <input
              id="cert-reason"
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
              placeholder="Family shifted to another city"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded"
        >
          Generate &amp; Print TC
        </button>
      </div>
    </div>
  );
}
