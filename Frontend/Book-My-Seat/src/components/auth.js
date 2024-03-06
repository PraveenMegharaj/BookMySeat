export let isLoggedIn = sessionStorage.getItem('userData') ? true : false;

export const getLoginStatus = () => {
  return isLoggedIn;
};

export const updateLoginStatus = (status) => {
  isLoggedIn = status;
};
