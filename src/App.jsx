import { useState, useEffect } from "react";
import "./App.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    let start = null;
    const from = display;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(from + (target - from) * progress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return display;
}

function App() {
  const [subjects, setSubjects] = useState(() => {
    const savedSubjects = localStorage.getItem("subjects");
    return savedSubjects
      ? JSON.parse(savedSubjects)
      : [
          { id: 1, name: "Bases de Datos", grade: 4.5 },
          { id: 2, name: "Programación", grade: 4.2 },
          { id: 3, name: "Cálculo", grade: 3.8 },
        ];
  });

  const [newSubject, setNewSubject] = useState("");
  const [newGrade, setNewGrade] = useState("");

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!newSubject || !newGrade) {
      alert("Debes completar todos los campos correctamente");
      return;
    }
    if (newGrade < 0 || newGrade > 5) {
      alert("La nota debe estar entre 0 y 5");
      return;
    }
    setSubjects([...subjects, { id: Date.now(), name: newSubject, grade: parseFloat(newGrade) }]);
    setNewSubject("");
    setNewGrade("");
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const average =
    subjects.length > 0
      ? subjects.reduce((acc, subject) => acc + subject.grade, 0) / subjects.length
      : 0;
  const animatedAverage = useAnimatedNumber(average);

  let status = "";
  if (average >= 4) {
    status = "Excelente ⭐";
  } else if (average >= 3) {
    status = "Aprobado 👍";
  } else {
    status = "En Riesgo ⚠️";
  }

  const gradeColor = (grade) => {
    if (grade >= 4) return "#34D399";
    if (grade >= 3) return "#FCD34D";
    return "#FB7185";
  };

  return (
    <div
      style={{
        backgroundColor: "#0C0A09",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "40px", color: "#FCD34D", marginBottom: "8px" }}>
        Dashboard Académico
      </h1>
      <p style={{ color: "#78716C", marginBottom: "32px", marginTop: 0 }}>
        Seguimiento de tu rendimiento académico
      </p>

      <div
        style={{
          backgroundColor: "#1C1917",
          padding: "24px",
          borderRadius: "16px",
          width: "260px",
          marginBottom: "32px",
          border: "1px solid #292524",
        }}
      >
        <p style={{ color: "#78716C", fontSize: "13px", margin: "0 0 6px" }}>
          Promedio General
        </p>
        <p style={{ fontSize: "48px", fontWeight: "bold", margin: "0 0 4px", color: "#FCD34D" }}>
          {animatedAverage.toFixed(1)}
        </p>
        <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px", color: "#F59E0B" }}>
          {status}
        </p>
        <p style={{ color: "#78716C", fontSize: "13px", margin: 0 }}>
          {subjects.length} materia{subjects.length !== 1 ? "s" : ""} registrada{subjects.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Materia"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #292524",
            backgroundColor: "#1C1917",
            color: "white",
            outline: "none",
          }}
        />
        <input
          type="number"
          placeholder="Nota (0–5)"
          value={newGrade}
          onChange={(e) => setNewGrade(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #292524",
            backgroundColor: "#1C1917",
            color: "white",
            width: "110px",
            outline: "none",
          }}
        />
        <button
          onClick={addSubject}
          style={{
            backgroundColor: "#F59E0B",
            color: "#0C0A09",
            border: "none",
            borderRadius: "10px",
            padding: "10px 22px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Agregar
        </button>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {subjects.length === 0 && (
          <div
            style={{
              width: "100%",
              padding: "48px 24px",
              borderRadius: "14px",
              border: "1.5px dashed #3C3835",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "40px" }}>🎓</span>
            <p style={{ color: "white", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
              No tienes materias registradas
            </p>
            <p style={{ color: "#78716C", fontSize: "13px", margin: 0 }}>
              Agrega tu primera materia para comenzar
            </p>
          </div>
        )}
        {subjects.map((subject) => (
          <div
            key={subject.id}
            style={{
              backgroundColor: "#1C1917",
              padding: "20px",
              borderRadius: "14px",
              width: "200px",
              border: "1px solid #292524",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#78716C",
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Materia
            </p>
            <h2 style={{ fontSize: "16px", margin: "0 0 12px", color: "white" }}>
              {subject.name}
            </h2>
            <p
              style={{
                color: gradeColor(subject.grade),
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 14px",
              }}
            >
              {subject.grade.toFixed(1)}
            </p>
            <button
              className="delete-btn"
              onClick={() => deleteSubject(subject.id)}
              style={{
                backgroundColor: "#3C3835",
                color: "#78716C",
                border: "1px solid #44403C",
                borderRadius: "8px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s ease",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {subjects.length > 0 && (
        <div style={{ marginTop: "40px", animation: "fadeSlideUp 0.5s 0.3s ease both" }}>
          <p style={{ color: "#78716C", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Comparativa de notas
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjects} barSize={36}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#78716C", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fill: "#78716C", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{ backgroundColor: "#292524", border: "1px solid #3C3835", borderRadius: "10px", color: "white" }}
                formatter={(value) => [value.toFixed(1), "Nota"]}
              />
              <Bar dataKey="grade" radius={[6, 6, 0, 0]}>
                {subjects.map((s) => (
                  <Cell key={s.id} fill={gradeColor(s.grade)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default App;
