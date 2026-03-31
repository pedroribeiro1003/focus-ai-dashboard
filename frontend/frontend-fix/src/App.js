import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔥 FALLBACK INTELIGENTE (resolve seu problema)
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://focus-ai-dashboard-603p.onrender.com";

  const fetchTasks = () => {
    fetch(`${API_URL}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Erro ao buscar tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  };

  const toggleTask = async (index) => {
    try {
      await fetch(`${API_URL}/tasks/${index}`, {
        method: "PUT"
      });

      fetchTasks();
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;

  const data = {
    labels: ["Concluídas", "Pendentes"],
    datasets: [
      {
        label: "Tarefas",
        data: [completed, pending],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  };

  const getInsight = () => {
    if (tasks.length === 0) return "Você ainda não começou.";
    if (completed === 0) return "Você está acumulando tarefas ⚠️";
    if (completed < tasks.length / 2)
      return "Tente concluir mais tarefas 💪";
    return "Ótimo desempenho! Continue assim 🔥";
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      color: "white"
    }}>
      <div style={{
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(10px)",
        padding: 30,
        borderRadius: 15,
        width: 320,
        textAlign: "center"
      }}>
        <h1>FocusAI 🚀</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma tarefa"
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            border: "none",
            outline: "none",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={addTask}
          style={{
            width: "100%",
            padding: 12,
            background: "#22c55e",
            border: "none",
            borderRadius: 8,
            color: "white",
            cursor: "pointer"
          }}
        >
          Adicionar
        </button>

        <ul style={{ marginTop: 20, padding: 0 }}>
          {tasks.map((task, index) => (
            <li
              key={index}
              onClick={() => toggleTask(index)}
              style={{
                listStyle: "none",
                padding: 10,
                marginBottom: 8,
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                cursor: "pointer",
                textDecoration: task.done ? "line-through" : "none",
                opacity: task.done ? 0.5 : 1
              }}
            >
              {task.done ? "✅" : "⬜"} {task.title}
            </li>
          ))}
        </ul>

        <p style={{ marginTop: 10 }}>
          🧠 {getInsight()}
        </p>

        <div style={{ marginTop: 20 }}>
          <Bar data={data} />
        </div>

      </div>
    </div>
  );
}

export default App;