const BASE_URL = 'https://mobile-punch.connectedbarrelapi.com/';

export const registerUser = async phoneNumber => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({phoneNumber}),
  };
  const response = await fetch(BASE_URL + 'register/', requestOptions);
  return await response.json();
};

export const verifyUserOTP = async (phoneNumber, pincode) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + pincode,
    },
  };
  const response = await fetch(
    BASE_URL + 'projects/' + phoneNumber,
    requestOptions,
  );
  return await response.json();
};

export const getUserProjects = async (phoneNumber, pincode) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + pincode,
    },
  };
  const response = await fetch(
    BASE_URL + 'projects/' + phoneNumber,
    requestOptions,
  );
  return await response.json();
};
