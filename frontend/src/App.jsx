import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:8000/api/todos/";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all todos on mount
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not connect to backend. Is Django running?");
        setLoading(false);
      });
  }, []);

  // Add a new todo
  const addTodo = async () => {
    const title = input.trim();
    if (!title) return;

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput("");
    } catch {
      setError("Failed to add task.");
    }
  };

  // Toggle completed status
  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${API}${todo.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch {
      setError("Failed to update task.");
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}${id}/`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <header>
          <h1>My Tasks</h1>
          <span className="badge">
            {completedCount}/{todos.length} done
          </span>
        </header>

        {error && (
          <div className="error">
            ⚠ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No tasks yet — add one above!</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />
                <span className="title">{todo.title}</span>
                <button
                  className="del"
                  onClick={() => deleteTodo(todo.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
