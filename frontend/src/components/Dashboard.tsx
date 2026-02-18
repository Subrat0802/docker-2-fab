import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

interface Todo {
    id: number;
    title: string;
    done: boolean;
    userId: string;
}

const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const todoRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const fetchTodos = async () => {
        try {
            const response = await fetch("http://localhost:3000/getAllTodos", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) return;
            setTodos(data.response ?? []);
        } catch (error) {
            console.log("Error while fetching todos", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchTodos(); }, []);

    const addTodo = async () => {
        const todoText = todoRef.current?.value;
        if (!todoText) return;

        await fetch("http://localhost:3000/createTodo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title: todoText })
        });

        if (todoRef.current) todoRef.current.value = "";
        await fetchTodos();
    }

    const toggleTodo = async (id: number) => {
        await fetch(`http://localhost:3000/updateTodo/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        await fetchTodos();
    }
    const handleLogout = () => {
        localStorage.setItem("user", "");
        navigate("/")
    }

    if (loading) return <p>Loading...</p>

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto", padding: "16px", fontFamily: "sans-serif" }}>
            <p style={{cursor: "pointer"}} onClick={handleLogout}>Logout</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                <input
                    ref={todoRef}
                    placeholder="Add todo"
                    style={{ flex: 1, border: "1px solid #ccc", borderRadius: "6px", padding: "8px 12px", outline: "none", fontSize: "14px" }}
                />
                <button
                    onClick={addTodo}
                    style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}
                >
                    Add
                </button>
            </div>

            {todos.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center" }}>No todos yet</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            onClick={() => toggleTodo(todo.id)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer" }}
                        >
                            <p style={{ margin: 0, textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#9ca3af" : "#000" }}>
                                {todo.title}
                            </p>
                            <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "999px", background: todo.done ? "#dcfce7" : "#fef9c3", color: todo.done ? "#16a34a" : "#ca8a04" }}>
                                {todo.done ? "Done" : "Pending"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard