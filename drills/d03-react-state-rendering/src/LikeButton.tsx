import { useState } from "react";

export function LikeButton() {
  const [likes, setLikes] = useState(0);

  function likeTwice() {
    setLikes((l) => l + 1);
    setLikes((l) => l + 1);
  }

  return (
    <div>
      <p>Likes: {likes}</p>
      <button onClick={() => setLikes((l) => l + 1)}>Like</button>
      <button onClick={likeTwice}>+2</button>
    </div>
  );
}
