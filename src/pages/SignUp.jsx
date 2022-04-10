import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
        <main>
          <form>
            <input
              type='text'
              className='nameInput'
              value={name}
              placeholder='Name'
              id='name'
              onChange={onChange}
            />
            <input
              type='email'
              className='emailInput'
              value={email}
              placeholder='Email'
              id='email'
              onChange={onChange}
            />
            <div className='passwordInputDiv'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='passwordInput'
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt='show password'
                className='showPassword'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <Link className='forgotPasswordLink' to='/forgot-password'>
              Forgot Password
            </Link>

            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button className='signInButton'>
                <ArrowRightIcon width='34px' height='34px' fill='#ffffff' />
              </button>
            </div>
          </form>
          {/* OAuth here */}

          <Link to='/sign-in' className='registerLink'>
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
