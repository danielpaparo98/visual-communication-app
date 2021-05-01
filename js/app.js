Vue.component('img-modal', {
    data: function () {
        return {

        }
    },

    template: `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Pick an icon</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                top
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Change Image</button>
            </div>
            </div>
        </div>
    </div>
    `
})

Vue.component('comm-card', {
    data: function () {
        return {
            img_addr: 'https://via.placeholder.com/20',
            img_alt: '',
            heading: '',
            subtitle: '',
        }
    },
    template: `
    <div class="card">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">            <img data-toggle="modal" v-bind:src="img_addr" class="card-img-top" alt="img_alt">
        </button>
        <img-modal></img-modal>
        <div class="card-body">
        <h4 class="text-center d-print-only">{{ heading }}</h4>
        <input v-model="heading" class="heading-input text-center d-print-none">
        <p class="text-center d-print-only">{{ subtitle }}</p>
        <input v-model="subtitle" class="text-center d-print-none">
        </div>
    </div>
    `
})


var app = new Vue({
    el: '#app',
})