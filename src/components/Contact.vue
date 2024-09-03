<script setup>
import { ref } from "vue";
const WEB3FORMS_ACCESS_KEY = "673178c7-709e-44c1-8672-9fc6739891d4";
const firstname = ref("")
const lastname = ref("")
const email = ref("")
const subject = ref("")
const message = ref("")

const submitForm = async () => {
    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
        }),
    });
    const result = await response.json();
    if (result.success) {
        console.log(result);
    }
}
</script>

<template>
    <main class="py-14">
        <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div class="max-w-lg mx-auto space-y-3 sm:text-center">
                <h3 class="text-indigo-600 font-semibold">
                    Contact
                </h3>
                <p class="text-gray-800 text-3xl font-semibold sm:text-4xl">
                    Get in touch
                </p>
                <p>
                    We’d love to hear from you! Please fill out the form bellow.
                </p>
            </div>
            <div class="mt-12 max-w-lg mx-auto">
                <form @submit.prevent="submitForm" class="space-y-5">
                    <div class="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                        <div>
                            <label class="font-medium">
                                First name
                            </label>
                            <input type="text" name="firstname" v-model="firstname" required
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                        </div>
                        <div>
                            <label class="font-medium">
                                Last name
                            </label>
                            <input type="text" name="lastname" v-model="lastname" required
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label class="font-medium">
                            Email
                        </label>
                        <input type="email" name="email" v-model="email" required
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                    </div>
                    <div>
                        <label class="font-medium">
                            Subject
                        </label>
                        <input type="text" name="subject" v-model="subject" required
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                    </div>
                    <div>
                        <label class="font-medium">
                            Message
                        </label>
                        <textarea name="message" v-model="message" required
                            class="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"></textarea>
                    </div>
                    <button
                        class="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </main>
</template>