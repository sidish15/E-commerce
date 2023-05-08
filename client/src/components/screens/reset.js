import { useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const PostData = () => {
    fetch("http://localhost:5000/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: data.message,
            classes: "#43a047 green darken-1",
          });
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div class="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          reset password
        </button>
      </div>
    </div>
  );
};

export default Reset;
