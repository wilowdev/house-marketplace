import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const googleOnClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      //check if user exists and if not create
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not login with Google');
    }
  };

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with</p>
      <button className='socialIconDiv' onClick={googleOnClick}>
        <img src={googleIcon} alt='Google' className='socialIconImg' />
      </button>
    </div>
  );
}

export default OAuth;
