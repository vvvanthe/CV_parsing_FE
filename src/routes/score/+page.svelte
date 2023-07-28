<script>
  import { Card, Button, Avatar,Modal ,GradientButton,Input } from "flowbite-svelte";
  import { Fileupload, Label, Listgroup, ListgroupItem,Helper, Toast,Img,Spinner   } from 'flowbite-svelte'
  import axios from "axios";
  import { BottomNav, BottomNavItem,Tooltip } from "flowbite-svelte"
  import pdf_logo from '$lib/images/r.png';
  let defaultModal = false;
  let upload_files=[]

  async function handleFileUpload() {
  
    const formData = new FormData();

    for (const file of upload_files) {
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

  $: {
    if (defaultModal===false){
      upload_files=[]
    }
  }

</script>
<div class="text-4xl font-bold text-center pt-1 pb-5">
  JD Matching
</div>


<Button >JD folder</Button>
<!-- List CV files -->
<div class=" grid grid-cols-3 gap-2 border-10 bg-slate-200 font-bold item-center p-3 rounded-lg shadow-md" >

  <Card>

    <p class="mb-3 font-medium text-gray-700 dark:text-gray-400 leading-tight">
      Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
    </p>
    <GradientButton outline color="purpleToBlue" class="w-fit">
      Scoring    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      
    </GradientButton>
  </Card>

  <Card>

    <p class="mb-3 font-medium text-gray-700 dark:text-gray-400 leading-tight">
      Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
    </p>
    <GradientButton outline color="purpleToBlue" class="w-fit">
      Scoring    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      
    </GradientButton>
  </Card>
  <Card>

    <p class="mb-3 font-medium text-gray-700 dark:text-gray-400 leading-tight">
      Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
    </p>
    <GradientButton outline color="purpleToBlue" class="w-fit">
      Scoring    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      
    </GradientButton>
  </Card>
</div>



<Modal title="Upload JD file" bind:open={defaultModal} autoclose size='sm'>
  <form class="pt-1" on:submit={handleFileUpload}>
    <div class="grid gap-6 mb-6 md:grid-cols-1">
     
        <Label class="pb-1" for='multiple_files' >Upload JD files</Label>
        <Fileupload id='multiple_files' multiple bind:files={upload_files} />

   </div>    
    <Listgroup items={upload_files} let:item class="mt-10">
      {#if item}
        {item.name} 
      {:else}
        <ListgroupItem>No files</ListgroupItem>
      {/if}
    </Listgroup>
    
  </form>
  <svelte:fragment slot='footer'>
    <Button on:click={handleFileUpload} disabled={upload_files.length===0}>Upload</Button>
    <Button color="alternative" on:click={()=>{upload_files=[]}}>Decline</Button>
  </svelte:fragment>
</Modal>





<BottomNav position="absolute" navType="application" classInner="grid-cols-1" outerClass='w-1/4'>

 
  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Create new item" appBtnPosition="middle" btnClass="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary-600 rounded-full hover:bg-primary-700 group focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800" on:click={() => defaultModal = true}>
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
        </svg>
      <Tooltip arrow={false}>Upload JD</Tooltip>
    </BottomNavItem>
  </div>

  
</BottomNav>


