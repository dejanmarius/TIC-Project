async function handleTokenExpiration(store, router) {
  let errorMessage = '';
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      store.commit('clearAuthState');
      setTimeout(() => {
        router.push('/login'); 
      }, 4000);
      errorMessage = 'Your session has expired. Please log in again.';
    } catch (error) {
      errorMessage = 'An error occurred during logout. Please try again.';
    }
    return errorMessage;
  }


  export { handleTokenExpiration };