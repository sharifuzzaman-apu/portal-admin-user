import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, resetForm, signupUser } from "./features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const form=useSelector((state) => state.auth.form);
    const { loading, error, user } = useSelector((state) => state.auth);

    const handleChange=(e)=>{
        dispatch(setFormData({[e.target.name]:e.target.value}));
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(signupUser(form));
    }

    useEffect(() => {
        if (user) {
            navigate("/user");
            dispatch(resetForm());
        }
    }, [user, navigate, dispatch]);

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
                value={form.email}
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
                value={form.phone}
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
                value={form.password}
                onChange={handleChange}
                required
              />

              <button className="btn btn-neutral mt-4" type="submit" disabled={loading} >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </fieldset>
          </form>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
export default SignUp;