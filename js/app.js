Vue.component('chart', {
    data: function () {
        return {
            cards: [],
            icons: [],
            change: 0
        }
    },
    mounted() {
        axios.get('/js/icons.json')
        .then((response)=> {
          this.icons=response.data;
        })
        
        if (localStorage.getItem('chartSave')) {
            // First check if there is a chart stored in local storage
            this.cards = JSON.parse(localStorage.getItem('chartSave'));
        }
        else {
            // If there is no stored chart, create a new one from scratch
            for (i = 0; i < 20; i++) {
                var img = this.icons[Math.floor(Math.random() * this.icons.length)];
                this.cards.push({
                    id: 'card-' + i,
                    img_addr: img.addr,
                    img_alt: img.alt,
                    heading: '',
                    subtitle: '',
                })
            }
            localStorage.setItem('chartSave', JSON.stringify(this.cards))
        }
    },
    watch: {
        'change': function (val) {
            localStorage.setItem('chartSave', JSON.stringify(this.cards))

        }
    },
    methods: {
        increment: function () {
            this.change++;
        }
    },
    template: `
    <div class = "row gy-4 row-cols-2 row-cols-sm-4">
    <div v-for="card in this.cards">
    <div class="col" >
    <div class="card">
    <b-button v-b-modal=card.id class="modal-button">
    <img v-bind:src="card.img_addr" class="card-img-top" :alt=card.img_alt>
    </b-button>
    
    <div class="card-body">
    <h5 class="text-center d-print-only">{{ card.heading }}</h5>
    <input v-on:keyup="increment" v-model="card.heading" maxlength="12" class="heading-input text-center d-print-none">
    <p class="text-center d-print-only">{{ card.subtitle }}</p>
    <input v-on:keyup="increment" v-model="card.subtitle" maxlength="19" class="text-center d-print-none">
    </div>
    
    
    <b-modal :cardWatcher="this.cards" :id="card.id" size="lg" title="Select a new icon" centered ok-only scrollable  no-stacking>
    <div class="container">
    <div class="row">
    <div v-for="icon in icons" :key="icon.message" class="col-4 col-sm-2">
    <b-form-radio v-on:change="increment" v-model="card.img_addr"  name="icons" :value="icon.addr" >
    <img :src="icon.addr" :alt=icon.alt>
    </b-form-radio>
    </div>
    </div>
    </div>
    </b-modal>
    </div>
    </div>
    </div>
    </div>
    `
})


var app = new Vue({
    el: '#app',
})
