import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.init.js";


const SignUp = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email=event.target.email.value;
    const phone=event.target.phone.value;
    const password=event.target.password.value;
    console.log(email, phone, password);

    setError(null);

    // create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
    .then(result=>{
        console.log(result.user)
        navigate("/user");
    })
    .catch(error=>{
        console.log(error.message)
        setError(error.message);
    })
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Create an account</h1>
          <p className="py-6">
            Sign up to get started with managing your tasks effectively.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <fieldset className="fieldset gap-3">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input input-bordered"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleChange}
                required
              />

              <label className="label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input input-bordered"
                placeholder="123-456-7890"
                value={formState.phone}
                onChange={handleChange}
                required
              />

              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input input-bordered"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                required
              />

              <button className="btn btn-neutral mt-4" type="submit" >
                Sign Up
              </button>
            </fieldset>
          </form>
          {
            error && <p className="text-red-500 text-center mb-4">{error}</p>
          }
        </div>
      </div>
    </div>
  );
};

export default SignUp;
