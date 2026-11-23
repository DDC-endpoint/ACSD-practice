import { useToggle } from "./useToggle";

interface Props {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: Props) {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <h3>{question}</h3>
      <button onClick={toggle}>{open ? "Hide answer" : "Show answer"}</button>
      {open && <p>{answer}</p>}
    </div>
  );
}
