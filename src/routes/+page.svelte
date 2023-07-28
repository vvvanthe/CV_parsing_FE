<script>
  import { Card, Button, Avatar,Modal ,GradientButton,Input } from "flowbite-svelte";
  import { Fileupload, Label, Listgroup, ListgroupItem,Helper, Toast,Img,CloseButton  } from 'flowbite-svelte'
  import axios from "axios";
  import { BottomNav, BottomNavItem,Tooltip } from "flowbite-svelte"
  import pdf_logo from '$lib/images/r.png';
  let defaultModal = false;
  let upload_files=[]
  // check condition to clean upload_files
  $: {
    if (defaultModal===false){
      upload_files=[]
    }
  }
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
</script>
<div class="text-4xl font-bold text-center pt-1 pb-5">
  CV Extraction
</div>


<Button >CV folder</Button>
<!-- List CV files -->
<div class=" grid grid-cols-4 gap-2 border-10 bg-slate-200 font-bold item-center p-3 rounded-lg shadow-md" >

  <div class="flex items-center space-x-4 clickable-div ">
    <Avatar src={pdf_logo} rounded/>
    
    <div class=" font-medium dark:text-white ">
        <div  class="text-sm  dark:text-white">LE Van A</div>
    </div>
</div>
<div class="flex items-center space-x-4 clickable-div ">
  <Avatar src={pdf_logo} rounded/>
  <div class="font-medium dark:text-white ">
      <div  class="text-sm  dark:text-white">Nguyen Hoang Thao Mai</div>
  </div>
</div>
</div>



<Modal title="Upload CV files" bind:open={defaultModal} autoclose >
  <form class="pt-1" on:submit={handleFileUpload}>
    <div class="grid gap-6 mb-6 md:grid-cols-1">
     
        <Label class="pb-1" for='multiple_files' >Upload CV files</Label>
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






<BottomNav position="absolute" navType="application" classInner="grid-cols-3" outerClass='w-1/2'>
  <BottomNavItem btnName="Home" appBtnPosition="left">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABiklEQVR4nO2WwUrDQBCGv75ET9oepAhefQJrX8CH8E3qYyg9Fq3ebLX11JBbb76DoEWwendlYAJDSJrdZBHE/jBkdzLs/Jt/ZjewQxw8AU5twS+ja5Jn1mmyYBtYFSxaZAlwpuMHNac+QQs4B26BQ9/kz57J7SeX54WajOfAwLwTe6ki0TbJLYkyWBLfwAnQ17F992rWm2wjsDLJ2wEELoFj45fxCPgCxsAR8KaxIofXjlwAgSqMjVStUAJLj/ieFtmn2p3RuqVfQuJOq5g6zx3l49cFxN+BPY0bqe9Ru6PrQyCtaD0bL3avCcWm6rs2NZEvzEUVgWQLgUwW68t2K9hX38b4pEOG5pxwMSVwJQQ+jK8fSiANlGCqicVmuZ4vkmAeU4J1SRFKd9QuQh9k8QfAjWq+0Z33Ctpw4LtgqATRD6JQCa5iH8W+iH4ZuZo21+ew6XWc1Ei+9Pwhmfj+kNRBp4CYnAfBSE2Fh84XVYeMD1yuCEPnjZHk7v/Q+d9H2qAGosDtauBf4geYeFfVSi4HXQAAAABJRU5ErkJggg==" alt="">
      <Tooltip arrow={true}>Extract</Tooltip>
  </BottomNavItem>
 
  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Create new item" appBtnPosition="middle" btnClass="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary-600 rounded-full hover:bg-primary-700 group focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800" on:click={() => defaultModal = true}>
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
        </svg>
      <Tooltip arrow={false}>Upload CV</Tooltip>
    </BottomNavItem>
  </div>

  <BottomNavItem btnName="Profile" appBtnPosition="right">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO3VwQnCMBjF8Qe6hnYRO4FSPNcJ9FxBF9AJdAKdQCcwE9gJdAOPFaFKoFfBvPdJEPuH3JLvR3IJ0PZ5YwAZInQHUH1reNYMfwauin0NR2DvlosFn5ib/1c3g2f2M4IrDeAzAx8N4AMDbw3gDQMvDeAFA08M4JyBUwN4wMB9A7jHwB0ADwH1Z7sguwrwBUIu1uewF+CdAq8FeKXAMwGeKvBIgIcKnACoCbRuzkrNA/9mv7dQ0bbf7wXRGEWDOGx/GAAAAABJRU5ErkJggg=="  alt="">
      <Tooltip arrow={false}>Delete all</Tooltip>
  </BottomNavItem>
</BottomNav>


<style>
  /* Example styles using Tailwind CSS */
  .clickable-div {
    cursor: pointer;
    background-color: rgb(66, 149, 237);
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    height: 65px;
    width: 100%;

  }
</style>