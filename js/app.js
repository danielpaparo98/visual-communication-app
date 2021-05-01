Vue.component('comm-card', {
    template: `
    <div class="card" style="width: 18rem;">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
    <h4 class="card-title text-center">Insert text here</h4>
    <p class="card-text text-center">Subtitle</p>
    </div>
    </div>
    
    `
  })
  

var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })