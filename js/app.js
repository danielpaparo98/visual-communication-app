Vue.component('chart', {
    data: function () {
        return {
            cards: [],
            title: "My First Chart!",
            icons: [],
            change: 0
        }
    },
    mounted() {

        this.icons = getIcons();

        if (localStorage.getItem('chartTitle')) {
            this.title = JSON.parse(localStorage.getItem('chartTitle'));
        }

        if (localStorage.getItem('chartSave')) {
            // First check if there is a chart stored in local storage
            this.cards = JSON.parse(localStorage.getItem('chartSave'));
        }
        else {
            // If there is no stored chart, create a new one from scratch
            for (i = 0; i < 20; i++) {
                const img = this.icons[Math.floor(Math.random() * this.icons.length)];
                this.cards.push({
                    id: 'card-' + i,
                    img_addr: img.addr,
                    img_alt: img.alt,
                    heading: '',
                    subtitle: '',
                })
            }
        }
        localStorage.setItem('chartSave', JSON.stringify(this.cards))
        localStorage.setItem('chartTitle', JSON.stringify(this.title))
    },
    watch: {
        'change': function (val) {
            localStorage.setItem('chartSave', JSON.stringify(this.cards))
            localStorage.setItem('chartTitle', JSON.stringify(this.title))
        }
    },
    methods: {
        increment: function () {
            this.change++;
        },

        printchart: function () {
            print();
        },

        clearchart: function () {
            this.$bvModal.msgBoxConfirm('Are you sure you want to clear your chart? Once deleted, your old chart cannot be recovered')
                .then(value => {
                    if (value == true) {
                        this.title = "My Next Chart!";
                        this.cards = []
                        for (i = 0; i < 20; i++) {
                            const img = this.icons[Math.floor(Math.random() * this.icons.length)];
                            this.cards.push({
                                id: 'card-' + i,
                                img_addr: img.addr,
                                img_alt: img.alt,
                                heading: '',
                                subtitle: '',
                            })
                        }
                        localStorage.setItem('chartSave', JSON.stringify(this.cards))
                        localStorage.setItem('chartTitle', JSON.stringify(this.title))
                    }
                })
                .catch(err => {
                    // An error occurred
                })
        },

    },
    template: `
    <section>
    <div class="chart-heading">
    <div class="header-controls text-center d-print-none">
        <b-button v-on:click="printchart" variant="link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
        <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
      </svg> Print</b-button>
        <b-button v-on:click="clearchart"  variant="link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
      </svg> Clear</b-button>
    </div>
    <h1 class="d-print-only text-center">{{title}}</h1>
    <input v-on:change="increment" v-model.lazy="title" maxlength="40" class="text-center d-print-none">
    </div>

    <div class = "row gy-4 row-cols-2 row-cols-sm-4">
    <div v-for="card in this.cards">
    <div class="col" >
    <div class="card">
    <b-button v-b-modal=card.id class="modal-button">
    <img v-bind:src="card.img_addr" class="card-img-top" :alt=card.img_alt>
    </b-button>
    
    <div class="card-body">
    <h5 class="text-center d-print-only">{{ card.heading }}</h5>
    <input v-on:change="increment" v-model.lazy="card.heading" maxlength="12" class="heading-input text-center d-print-none">
    <p class="text-center d-print-only">{{ card.subtitle }}</p>
    <input v-on:change="increment" v-model.lazy="card.subtitle" maxlength="19" class="text-center d-print-none">
    </div>
    
    
    <b-modal :cardWatcher="this.cards" :id="card.id" size="lg" title="Select a new icon" centered ok-only scrollable  no-stacking>
    <div class="container">
    <div class="row">
    <div v-for="icon in icons" :key="icon.message" class="col-4 col-sm-2">
    <b-form-radio v-on:change="increment" v-model.lazy="card.img_addr"  name="icons" :value="icon.addr" >
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
    </section>
    `
})


var app = new Vue({
    el: '#app',
})
