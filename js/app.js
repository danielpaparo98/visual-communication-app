Vue.component('img-modal', {
    data: function () {
        return {

        }
    },

    template: `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Pick an icon</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-check">
                <input class="form-check-input" type="radio" value="0" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                Default checkbox
                </label>
                <input class="form-check-input" type="radio" value="1" id="test">
                <label class="form-check-label" for="test">
                Default checkbox
                </label>
                </div>
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
    <button type="button" class="btn btn-primary modal-button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        <img data-toggle="modal" v-bind:src="img_addr" class="card-img-top" alt="img_alt">
    </button>
    <img-modal></img-modal>
    <div class="card-body">
        <h5 class="text-center d-print-only">{{ heading }}</h5>
        <input v-model="heading" maxlength="12" class="heading-input text-center d-print-none">
        <p class="text-center d-print-only">{{ subtitle }}</p>
        <input v-model="subtitle" maxlength="19" class="text-center d-print-none">
    </div>
    </div>
    `
})


var app = new Vue({
    el: '#app',
})