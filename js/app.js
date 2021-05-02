Vue.component('comm-card', {
    props:['modal_id'],
    data: function () {
        return {
            img_addr: '/img/icons/user.svg',
            img_alt: '',
            heading: '',
            subtitle: '',
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


        <b-modal :id="modal_id" size="lg" title="Select a new icon" ok-only no-stacking>
          <p class="my-2">First Modal</p>
          <b-form-radio v-model="img_addr" v-bind="img_addr" :aria-describedby="ariaDescribedby" name="icons" value="img/icons/watch.svg">Option A</b-form-radio>
          <b-form-radio v-model="img_addr" :aria-describedby="ariaDescribedby" name="icons" value="img/icons/zoom-in.svg">Option B</b-form-radio>
        </b-modal>
    </div>
    `
})

var app = new Vue({
    el: '#app',
})