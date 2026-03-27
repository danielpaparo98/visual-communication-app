<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 py-20 sm:py-32">
    <!-- Animated Background Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
    
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 pattern-bg"></div>
    
    <div class="container mx-auto px-4 relative">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Decorative icon badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 animate-fade-in">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Free & Open Source
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg">
          The Talking Chart
        </h1>
        <p class="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
          Create visual communication charts for individuals with communication difficulties.
          <span class="text-white font-medium">Free, easy to use, and works offline.</span>
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/chart">
            <AppButton variant="secondary" size="lg" class="shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300">
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </template>
              Create a Chart Now
            </AppButton>
          </NuxtLink>
          <a href="#about" class="group flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <span>Learn more</span>
            <svg class="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
        
        <!-- Stats row -->
        <div class="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold text-white">180+</div>
            <div class="text-sm text-white/70">Icons</div>
          </div>
          <div class="text-center border-x border-white/20">
            <div class="text-2xl sm:text-3xl font-bold text-white">5</div>
            <div class="text-sm text-white/70">Categories</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold text-white">100%</div>
            <div class="text-sm text-white/70">Free</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom wave decoration -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero section component
</script>

<style scoped>
.pattern-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 100px;
  left: 10%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 60%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -20px) rotate(5deg);
  }
  50% {
    transform: translate(-10px, 10px) rotate(-5deg);
  }
  75% {
    transform: translate(15px, 15px) rotate(3deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
