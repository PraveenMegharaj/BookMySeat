export const isAuthenticated = () => {
 
    const token = sessionStorage.getItem('token');
    console.log(token);
    return !!token; 
  };
   
   
  export const storeToken = (token) => sessionStorage.setItem("token", token);
   
  export const getToken = () => sessionStorage.getItem("token");
  