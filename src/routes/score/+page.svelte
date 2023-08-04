<script>
  import { Card, Button, Avatar,Modal ,GradientButton,Input } from "flowbite-svelte";
  import { Fileupload, Label, Listgroup, ListgroupItem,Helper,Img,Spinner   } from 'flowbite-svelte'
  import axios from "axios";
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import { BottomNav, BottomNavItem,Tooltip,Popover } from "flowbite-svelte"
  import { onMount, afterUpdate  } from "svelte";

  let defaultModal = false;
  let scoringModal = false;
  let upload_files=[]
  let flagLoading = false
  let temp
  let jd_files=[]
  let tableData =[]
  let temTable = []
  let messE = ''
  async function handleFileUpload() {
    flagLoading = true
    const formData = new FormData();

    for (const file of upload_files) {
      formData.append("jd_files", file);
    }

    try {
      const response = await axios.post("https://cvscreenbe.ap.ngrok.io/api/upload_jd", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        maxRedirects: 0, // Disable redirects
      });

      console.log("Server Response:", response.data);
      flagLoading = true
      try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_jdlist');
		  temp = await response2.json();
      jd_files = await temp.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

      

      // Handle the response data as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle the error
    }
  }

  async function handleScoring(jdfilename) {
    flagLoading = true
    scoringModal= true

    
    let formData = {
    jd_file : jdfilename,

  };
      try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/cv_score');
      
      

    } catch (error) {
      
      console.error("Error fetching data:", error);
      flagLoading = false
      messE = 'Extracting error'
    }
 

    try {
      const response = await axios.post("https://cvscreenbe.ap.ngrok.io/api/load_score", new URLSearchParams(formData).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxRedirects: 0, // Disable redirects
      });
      tableData = response.data.data
      // console.log("Server Response:", response.data.data);
      flagLoading = false
      // Handle the response data as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      messE = 'Loading error'
      flagLoading = false
      // Handle the error
    }
    
  }

  $: {
    if (defaultModal===false){
      upload_files=[]
    }
  }

  $: {
    if (defaultModal===false){
      upload_files=[]
    }
  }
  onMount(async () => {
      try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_jdlist');
		  temp = await response2.json();
      jd_files = await temp.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }   
  });

  afterUpdate(async () => {
    // try {
    //   const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_jdlist');
		//   temp = await response2.json();
    //   jd_files = await temp.data;
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
   
  });
  let searchTerm = '';

  $: filteredItems = tableData.filter(
    (item) => item.cv_filename.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );


</script>
<div class="text-4xl font-bold text-center pt-1 pb-5">
  JD Matching
</div>


<Button >JD folder</Button>

<!-- List CV files -->
<div class=" grid grid-cols-3 gap-2 border-10 bg-slate-200 font-bold item-center p-3 rounded-lg shadow-md" >

  

  {#each jd_files as jdname (jdname)}
  <Card>

    <p class="mb-3 font-medium text-gray-700 dark:text-gray-400 leading-tight">
      {jdname}
    </p>
    <GradientButton  color="purpleToBlue" class="w-fit" on:click={()=>{handleScoring(jdname)}}>
      Scoring    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      
    </GradientButton>
  </Card>
{/each}
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
    <Button color="alternative" on:click={()=>{upload_files=[]}}>Exit</Button>
  </svelte:fragment>
</Modal>




<Modal title="Scoring windows" bind:open={scoringModal} autoclose size='xl'>
  
  {#if flagLoading}
  <div class="flex items-center text-center justify-center w-full">
    
    <br>
    <p class="text-lg text-purple-700 font-bold">Extracting... &nbsp</p>
    <Spinner color="purple" />
  </div>

  
    {:else}
    {#if messE ===''}

    <TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}  striped={true} >
      <TableHead>
        
        <Popover class="w-64 text-sm font-light normal-case" title="Meaning" triggeredBy="#b1">
          And here's some amazing content. It's very engaging. Right?
        </Popover>
        <Popover class="w-64 text-sm font-light normal-case" title="Meaning" triggeredBy="#b2">
          And here's some amazing content. It's very engaging. Right?
        </Popover>
        <Popover class="w-64 text-sm font-light normal-case" title="Meaning" triggeredBy="#b3">
          And here's some amazing content. It's very engaging. Right?
        </Popover>
        <Popover class="w-64 text-sm font-light normal-case" title="Meaning" triggeredBy="#b4">
          And here's some amazing content. It's very engaging. Right?
        </Popover>
        <Popover class="w-64 text-sm font-light normal-case" title="Meaning" triggeredBy="#b5">
          And here's some amazing content. It's very engaging. Right?
      </Popover>
      </TableHead>
      <TableHead>
        
        <TableHeadCell  class='text-center'>Name</TableHeadCell>      
        <TableHeadCell id="b1" class='text-center'>Education</TableHeadCell>
        <TableHeadCell id="b2" class='text-center'>Skill</TableHeadCell>
        <TableHeadCell id="b3" class='text-center'>Experience</TableHeadCell>
        <TableHeadCell id="b4" class='text-center'>Overall</TableHeadCell>
        <TableHeadCell id="b5" class='text-center'>AI evaluation</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">

        {#each filteredItems as item}
          <TableBodyRow>
            <TableBodyCell tdClass='w-50'>{item.cv_filename}</TableBodyCell>
            <TableBodyCell>{item['Education match']}</TableBodyCell>
            <TableBodyCell>{item['Skill match']}</TableBodyCell>
            <TableBodyCell>{item['Experience match']}</TableBodyCell>
            <TableBodyCell>{item['Overall score']}</TableBodyCell>
            <TableBodyCell tdClass='w-200 text-justify pr-2'>{item['Overall evaluation']}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableSearch>
    {:else}
    <div class="flex items-center text-center justify-center w-full">
    
      <br>
      <p class="text-lg text-red-700 font-bold">{messE}!
    </div>

    {/if}
  {/if}

  <svelte:fragment slot='footer'>
    
    <Button color="alternative" on:click={()=>{upload_files=[]}}>Exit</Button>
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


