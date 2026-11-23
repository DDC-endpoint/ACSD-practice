import { useToggle } from "./useToggle";

interface Props {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: Props) {
  // TODO d04-4: use YOUR useToggle Hook to show/hide the answer.
  //   - const [open, toggle] = useToggle(false)
  //   - render <h3>{question}</h3>
  //   - a <button onClick={toggle}> labelled "Hide answer" when open, "Show answer" when closed
  //   - the answer in a <p>, only when open (use &&)
  return <p>TODO d04-4</p>;
}
