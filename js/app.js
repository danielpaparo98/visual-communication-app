Vue.component('chart-card', {
    props: ['modal_id', 'img_addr', 'img_alt', 'heading', 'subtitle', 'icons'],
    data: function () {
        return {
        }
    },
    template: `
    <div class="col" >
    <div class="card">
    <b-button v-b-modal=modal_id class="modal-button">
    <img v-bind:src="img_addr" class="card-img-top" :alt=img_alt>
    </b-button>
    
    <div class="card-body">
    <h5 class="text-center d-print-only">{{ heading }}</h5>
    <input v-model="heading" maxlength="12" class="heading-input text-center d-print-none">
    <p class="text-center d-print-only">{{ subtitle }}</p>
    <input v-model="subtitle" maxlength="19" class="text-center d-print-none">
    </div>
    
    
    <b-modal :id="modal_id" size="lg" title="Select a new icon" centered ok-only scrollable  no-stacking>
    <div class="container">
    <div class="row">
    <div v-for="icon in icons" :key="icon.message" class="col-4 col-sm-2">
    <b-form-radio v-model="img_addr"  name="icons" :value="icon.addr" >
    <img :src="icon.addr" :alt=icon.alt>
    </b-form-radio>
    </div>
    </div>
    </div>
    </b-modal>
    </div>
    </div>
    `
})

Vue.component('chart', {
    data: function () {
        return {
            cards: [],
            icons: [
                {
                    "addr": "img/icons/002-towel.svg",
                    "alt": "towel"
                },
                {
                    "addr": "img/icons/004-first aid kit.svg",
                    "alt": "first aid kit"
                },
            ]
            ,


        }
    },
    mounted() {
        if (localStorage.getItem('chartSave')) {
            // First check if there is a chart stored in local storage
            this.cards = JSON.parse(localStorage.getItem('chartSave'));
        }
        else {
            // If there is no stored chart, create a new one from scratch
            var img = this.icons[Math.floor(Math.random() * this.icons.length)];
            for (i = 0; i < 20; i++) {
                img = this.icons[Math.floor(Math.random() * this.icons.length)];
                console.log()
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

        console.log(this.cards);
    },
    template: `
    <div class = "row gy-4 row-cols-2 row-cols-sm-4">
    <div v-for="card in cards">
    <chart-card :modal_id="card.id" :icons="icons" :img_addr="card.img_addr" :img_alt="card.img_alt" :heading="card.heading" :subtitle="card.subtitle"></chart-card>
    </div>
    </div>
    `
})


var app = new Vue({
    el: '#app',
})