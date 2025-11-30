import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, resetForm } from "./features/authSlice";
import { loginUser } from "./features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useSelector((state) => state.auth.form);
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin");
      dispatch(resetForm());
      return;
    }
    if (user) {
      navigate("/user");
      dispatch(resetForm());
    }
  }, [user, navigate, dispatch]);
   const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Log in to access your account and manage your tasks
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <button className="btn btn-neutral mt-4" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </fieldset>
              </form>
              <button className="btn btn-neutral mt-4" onClick={handleSignUp}>
                Sign Up
              </button>
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
