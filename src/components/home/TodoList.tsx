import Checkbox from "../common/Checkbox";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  className?: string;
}

export default function TodoList({
  todos,
  onToggle,
  className = "",
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className={`px-4 py-2 text-subtitle-1 text-gray-500 ${className}`}>
        새 일정을 추가해 보세요!
      </p>
    );
  }

  return (
    <ul className={className}>
      {todos.map((todo) => (
        <li key={todo.id} className="px-4 py-2">
          <Checkbox
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
            label={
              <span className={todo.done ? "text-gray-400 line-through" : ""}>
                {todo.text}
              </span>
            }
          />
        </li>
      ))}
    </ul>
  );
}
