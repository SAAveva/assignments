import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

import { Footer } from './Footer';

export const LoginPage = () => {
  const [fullname, setUsername] = useState("");
  const [govId, setGovId] = useState("");
  const [formError, setFormError] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:3000/api/sessions/auth';

      const clean_fullname = fullname.replace(/^\s+|\s+$/g, '');
      const clean_gov_id = govId.replace(/^\s+|\s+$/g, '');
      const body = JSON.stringify({
        fullname: clean_fullname,
        gov_id: clean_gov_id
      });

      const headers = {
        "content-type": "application/json"
      };

      let response = await fetch(url, {method: 'POST', body, headers});
      if (!response.ok) {
        throw Error("couldn't login");
      }
      response = await response.json();
      const data = {...JSON.parse(body), session_id: response.session_id, id: response.id};
      await login(data);
    } catch (e) {
      setFormError(true);
    }

  };

  return (
    <div>
      <h1> Teacher Login </h1>
      <form className="login-form form" onSubmit={handleLogin}>
        {formError ? 
          <div className="form-errors">
            <div className="form-error">Name or ID are incorrect</div>
          </div>
          :
          null
        }
        <div className="form-field">
          <label htmlFor="fullname">full eame:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="govId">Gogvernment ID:</label>
          <input
            type="text"
            value={govId}
            onChange={(e) => setGovId(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Footer />
    </div>
  );
};
