import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./AuthForm";
import { api, auth } from "./api";

export default function App() {
  const [authed, setAuthed] = useState(!!auth.getToken());
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    api
      .listTodos()
      .then((data) => setTodos(data))
      .catch((err) => {
        if (/401|403/.test(err.message)) {
          auth.clear();
          setAuthed(false);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [authed]);

  const addTodo = async () => {
    const title = input.trim();
    if (!title) return;
    try {
      const newTodo = await api.createTodo(title);
      setTodos([newTodo, ...todos]);
      setInput("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updated = await api.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore — clearing locally anyway */
    }
    auth.clear();
    setTodos([]);
    setAuthed(false);
  };

  if (!authed) return <AuthForm onAuth={() => setAuthed(true)} />;

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <header>
          <h1>My Tasks</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge">
              {completedCount}/{todos.length} done
            </span>
            <span className="badge">{auth.getUsername()}</span>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "1px solid #2e2e2e",
                color: "#aaa",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: "0.7rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              logout
            </button>
          </div>
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
