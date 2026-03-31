import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const API_URL = "https://focus-ai-dashboard-603p.onrender.com";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (index) => {
    await fetch(`${API_URL}/tasks/${index}`, {
      method: "PUT",
    });

    fetchTasks();
  };

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;

  const data = {
    labels: ["Tarefas"],
    datasets: [
      {
        label: "Quantidade",
        data: [tasks.length],
        backgroundColor: "#22c55e",
      },
    ],
  };

  return (
    <div className="container">
      <div className="card">
        <h1>FocusAI 🚀</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma tarefa"
        />

        <button onClick={addTask}>Adicionar</button>

        <div className="tasks">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`task ${task.done ? "done" : ""}`}
              onClick={() => toggleTask(index)}
            >
              {task.title}
            </div>
          ))}
        </div>

        <p className="message">💬 Bom começo! Continue produtivo 🚀</p>

        <Bar data={data} />
      </div>
    </div>
  );
}

export default App;