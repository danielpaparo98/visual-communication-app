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
                <form onsubmit="event.preventDefault()" class="space-y-5">
                    <div class="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                        <div>
                            <label class="font-medium">
                                First name
                            </label>
                            <input type="text" required
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                        </div>
                        <div>
                            <label class="font-medium">
                                Last name
                            </label>
                            <input type="text" required
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label class="font-medium">
                            Email
                        </label>
                        <input type="email" required
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                    </div>
                    <div>
                        <label class="font-medium">
                            Phone number
                        </label>
                        <div class="relative mt-2">
                            <div class="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                                <select class="text-sm bg-transparent outline-none rounded-lg h-full">
                                    <option>US</option>
                                    <option>ES</option>
                                    <option>MR</option>
                                </select>
                            </div>
                            <input type="number" placeholder="+1 (555) 000-000" required
                                class="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label class="font-medium">
                            Message
                        </label>
                        <textarea required
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