<script>
  export let inputText 
</script>

<div class="absolute bottom-2 right-4 items-center inset-y-0 flex m ">
  <button
    type="submit"
    class="inline-flex items-center justify-center rounded-lg px-4 py-4 transition duration-500 ease-in-out text-white bg-[#11A37F] hover:opacity-50 w-14 h-10 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={inputText.length===0}
  >

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="h-6 w-6 ml-2 transform rotate-90"
    >
      <path
        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
      />
    </svg>
  </button>
</div>
