<template>
  <div class="wrapper">
    <div class="image-section"></div>
    <div class="form-section">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'; 

export default {
  components: {
    LoginForm
  }
};
</script>

<style scoped>

.wrapper {
  display: flex;
  height: 100vh; 
  max-width: 100%; 
  overflow: hidden;
}

.image-section {
  flex: 1;
  background-image: url('../assets/cinema-realistic-poster-with-illuminated-bucket-popcorn-drink-3d-glasses-reel-tickets-blue-background-with-tapes-vector-illustration_1284-77070.avif');
  background-size: cover;
  width: 0%;

}

.form-section {
  flex: 1;
  display: flex;
  justify-content: center;

}

@media (max-width: 768px) {
  .image-section {
    display: none; 
  }
  .wrapper {
    flex-direction: column; /* Așează secțiunile una sub alta pe ecrane mici */
    
  }

}

</style>