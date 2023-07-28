<svelte:head>
  <title>Home</title>
  <meta name="description" content="About this app" />
</svelte:head>

<script>
  import { Button, Modal ,GradientButton } from 'flowbite-svelte'
  import { Fileupload, Label, Listgroup, ListgroupItem,Helper, Toast } from 'flowbite-svelte'
  
  let files=[];  // FileList type
  let defaultModal = false;
  import { Input } from 'flowbite-svelte';
  import axios from 'axios';

  // onMount(async () => {
  //   getModal().open();
  // });

  async function handleFileUpload() {
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("name", 'Nam Long');
    formData.append("link", 'hehe');

    try {
      const response = await axios.post("http://localhost:8000/uploadfiles/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        maxRedirects: 0, // Disable redirects
      });

      console.log("Server Response:", response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle the error
    }
  }
</script>

<div class="text-6xl font-bold text-center pt-10">
  New Location
</div>
<!-- <Button on:click={() => defaultModal = true}>Default modal</Button> -->
<Modal title="Terms of Service" bind:open={defaultModal} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
  </p>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
  </p>
  <svelte:fragment slot='footer'>
    <Button on:click={() => alert('Handle "success"')}>I accept</Button>
    <Button color="alternative">Decline</Button>
  </svelte:fragment>
</Modal>


<input type="file" bind:files={files} multiple />
<button on:click={handleFileUpload}>Upload Files</button>

<form class="pt-10" on:submit={handleFileUpload}>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label class="pb-2" for='multiple_files' >Upload multiple files</Label>
      <Fileupload id='multiple_files' multiple bind:files={files} />
      <div class="pt-1">
  
      </div>
 </div>
    <div>
      <Label for="location" class="mb-2">Location</Label>
      <Input type="text" id="location" placeholder="Bach Khoa Univeristy" required  />
    </div>
    <div>
      <Label for="address" class="mb-2">Adress</Label>
      <Input type="text" id="address" placeholder="268 Lý Thường Kiệt St, District 10, Ho Chi Minh City" required  />
    </div>
    <div>
      <Label for="image_link" class="mb-2">Image link</Label>
      <Input type="text" id="image_link" placeholder="https://huongnghiep.hocmai.vn/2022/02/image1-92.png" required  />
    </div>
    

  </div>
  <Listgroup items={files} let:item class="mt-10">
    {#if item}
      {item.name} 
    {:else}
      <ListgroupItem>No files</ListgroupItem>
    {/if}
  </Listgroup>
  <div class="pt-4">
    <GradientButton shadow color="cyan"type="submit">Submit</GradientButton>
  </div>
  
</form>
<!-- <Modal>
  <div class="shadow-card flex flex-col rounded-xl bg-white bg-clip-border">
    <div class="text-secondary flex-1 p-6">
      <a>
        <h2 class="font-bold font-sans text-3xl text-blue-900 align-center">
          Please add your ID
        </h2>
      </a>
      <p class="mb-3 opacity-60">
        <input
          class="border rounded border-indigo-300 w-full py-2 px-4 text-lg"
          placeholder="user ID"
          type="text"

          on:keydown={(e) => {
            if (e.key === "Enter") {
              
            }
          }}
        />
      </p>
      <button
        class="middle none center rounded-lg bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        data-ripple-light="true"

      >
        Oke
      </button>
    </div>
  </div>
</Modal> -->



