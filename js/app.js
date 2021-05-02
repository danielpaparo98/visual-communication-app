
Vue.component('comm-card', {
    props:['modal_id'],
    data: function () {
        return {
            img_addr: '/img/icons/user.svg',
            img_alt: '',
            heading: '',
            subtitle: '',
            icons : [
                'img/icons/user.svg',
                'img/icons/watch.svg',
                'img/icons/zoom-in.svg',
                'img/icons/activty.svg',
                'img/icons/airplay.svg',
                'img/icons/alert-circle.svg',
                'img/icons/alert-triangle.svg',
                'img/icons/align-center.svg',
                'img/icons/align-justify.svg',
                'img/icons/align-right.svg',
                'img/icons/anchor.svg',
                'img/icons/aperture.svg',
                'img/icons/archive.svg',
                'img/icons/arrow-down-circle.svg',
                'img/icons/arrow-down-left.svg',
                'img/icons/bar-chart.svg',
                'img/icons/at-sign.svg',
                'img/icons/award.svg',
            ],
        }
    },
    template: `
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
                    <div v-for="icon in icons" :key="icon.message" class="col">
                            <b-form-radio v-model="img_addr"  name="icons" :value="icon" >
                                <img :src="icon" :alt=img_alt>
                            </b-form-radio>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
    `
})

var app = new Vue({
    el: '#app',
})