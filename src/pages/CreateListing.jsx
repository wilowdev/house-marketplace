import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast, Toast } from 'react-toastify';

function CreateListing() {
  const [gelocationEnabled, setGelocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, useRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error(
        'Discounted price cannot be higher or equal to regular price'
      );
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images!');
    }

    let geolocation = {};
    let location;

    //positionstack API key
    if (gelocationEnabled) {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_GEOCODE_API_KEY}&query=${address}`
      );

      const data = await response.json();

      geolocation.lat = data.data[0]?.latitude ?? 0;
      geolocation.lng = data.data[0]?.longitude ?? 0;

      location = data.data[0] ? data.data[0]?.label : undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error('Cound not get location based on address.');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    setLoading(false);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }

    //Files
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        images: e.target.files,
      }));
    }

    //Text/Boolean//Numbers

    if (!e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor='' className='formLabel'>
            Sell / Rent
          </label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label htmlFor='' className='formLabel'>
            Name
          </label>
          <input
            type='text'
            className='formInputName'
            id='name'
            value={name}
            maxLength='32'
            minLength='10'
            onChange={onMutate}
            required
          />
          <div className='formRooms flex'>
            <div>
              <label htmlFor='' className='formLabel'>
                Bedrooms
              </label>
              <input
                type='number'
                className='formInputSmall'
                id='bedrooms'
                value={bedrooms}
                min='1'
                max='50'
                onChange={onMutate}
                required
              />
            </div>
            <div>
              <label htmlFor='' className='formLabel'>
                Bathrooms
              </label>
              <input
                type='number'
                className='formInputSmall'
                id='bathrooms'
                value={bathrooms}
                min='1'
                max='50'
                onChange={onMutate}
                required
              />
            </div>
          </div>
          <label htmlFor='' className='formLabel'>
            Parking spot
          </label>
          <div className='formButtons'>
            <button
              type='button'
              className={parking ? 'formButtonActive' : 'formButton'}
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              type='button'
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              id='parking'
              value={false}
              onClick={onMutate}
              min='1'
              max='50'
            >
              No
            </button>
          </div>
          <label htmlFor='' className='formLabel'>
            Furnished
          </label>
          <div className='formButtons'>
            <button
              type='button'
              className={furnished ? 'formButtonActive' : 'formButton'}
              id='furnished'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              type='button'
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              id='furnished'
              value={false}
              onClick={onMutate}
              min='1'
              max='50'
            >
              No
            </button>
          </div>
          <label htmlFor='' className='formLabel'>
            Address
          </label>
          <textarea
            id='address'
            className='formInputAddress'
            type='text'
            value={address}
            onChange={onMutate}
            required
          />
          {!gelocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label htmlFor='' className='formLabel'>
                  Latitude
                </label>
                <input
                  type='number'
                  className='formInputSmall'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label htmlFor='' className='formLabel'>
                  Longitude
                </label>
                <input
                  type='number'
                  className='formInputSmall'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
          <label htmlFor='' className='formLabel'>
            Offer
          </label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              value={true}
              id='offer'
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              value={false}
              id='offer'
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor='' className='formLabel'>
            Regular Price
          </label>
          <div className='formPriceDiv'>
            <input
              type='number'
              className='formInputSmall'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />

            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>
          {offer && (
            <>
              <label htmlFor='' className='formLabel'>
                Discounted Price
              </label>
              <div className='formPriceDiv'>
                <input
                  type='number'
                  className='formInputSmall'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required={offer}
                />

                {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
              </div>
            </>
          )}

          <label htmlFor='' className='formLabel'>
            Images
          </label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            type='file'
            className='formInputFile'
            id='images'
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            onChange={onMutate}
            required
          />

          <button className='primaryButton createListingButton' type='submit'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
