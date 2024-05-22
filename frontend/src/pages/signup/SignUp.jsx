import { Link } from "react-router-dom";
import { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";
import  useSignup  from "../../hooks/useSignup.js";

const SignUp = () => {
  const [inputs, setInputs] = useState(
    {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    },
    []
  );
	const {loading, signup} = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
		signup(inputs);
  };

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full input input-bordered  h-10"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="비밀번호를 한번 더 입력하세요"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>

          <GenderCheckbox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={inputs.gender}
          />

          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
            이미 계정이 있습니까?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2 border border-slate-700"
            disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "회원가입"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
