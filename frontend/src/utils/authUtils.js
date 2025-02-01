async function handleTokenExpiration(store, router) {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      store.commit('clearAuthState');
      router.push('/login');
      alert('Your session has expired. Please log in again.');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  }

  export { handleTokenExpiration };