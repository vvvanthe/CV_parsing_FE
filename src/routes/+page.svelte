<script>
  import { Card, Button, Avatar,Modal ,GradientButton,Input } from "flowbite-svelte";
  import { Fileupload, Label, Listgroup, ListgroupItem,Spinner, Toast,Img,CloseButton  } from 'flowbite-svelte'
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import axios from "axios";
  import { BottomNav, BottomNavItem,Tooltip } from "flowbite-svelte"
  import pdf_logo from '$lib/images/r.png';
  import { onMount, afterUpdate  } from "svelte";
  import * as XLSX from "xlsx";
  let temp
  
  let cv_files=[]
  let defaultModal = false;
  let extractionModal=false;
  let flagLoading = false;
  let upload_files=[]
  let load_extractiontable=[]
  // check condition to clean upload_files


  $: {
    if (defaultModal===false){
      upload_files=[]
    }
  }
  async function handleFileUpload() {
    const formData = new FormData();
    for (const file of upload_files) {
      formData.append("cv_files", file);
    }
    try {
      const response = await axios.post("https://cvscreenbe.ap.ngrok.io/api/cv_uploadpdf", formData, {
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

  async function handleDelete() {
    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/delete_all');
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleExtraction() {
    extractionModal =true
    flagLoading = true
    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/cv_extract');
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/cv_score');
      flagLoading = false

    } catch (error) {
      flagLoading = false
      console.error("Error fetching data:", error);
    }

    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_extractiontable');
      temp = await response2.json();
      load_extractiontable = await temp.data;
      console.log(load_extractiontable[0]['Personal Information'])

    } catch (error) {

      console.error("Error fetching data:", error);
    }   
  }

  async function handleDownload() {
    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/extraction_excel');
      const blob = await response2.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "extractiondata.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  $: simplifiedData =load_extractiontable.map((item, index) => ({ id: index+1, Name: item['Personal Information'].Name, Birthday:item['Personal Information'].Birthday,DrPosition:item['Personal Information']["Desired position"], Email:item['Contact Information'].Email,Phone:item['Contact Information'].Phone   }))

  


  onMount(async () => {
      try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_cvpdflist');
		  temp = await response2.json();
      cv_files = await temp.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    
   
  });

  afterUpdate(async () => {
    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_cvpdflist');
		  temp = await response2.json();
      cv_files = await temp.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
   
  });

  
  
  let searchTerm = '';

  $: filteredItems = simplifiedData.filter(
    (item) => item.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

</script>
<div class="text-4xl font-bold text-center pt-1 pb-5">
  CV Extraction
</div>


<Button >CV folder</Button>
<!-- List CV files -->
<div class=" grid grid-cols-4 gap-2 border-10 bg-slate-200 font-bold item-center p-3 rounded-lg shadow-md" >

  
{#each cv_files as cvname (cvname)}
<div class="flex items-center space-x-4 clickable-div ">
  <Avatar src={pdf_logo} rounded/>
  
  <div class=" font-medium dark:text-white ">
      <div  class="text-sm  dark:text-white">{cvname}</div>
  </div>
</div>
{/each}


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




<Modal title="Extraction Window" bind:open={extractionModal} autoclose size='xl'>
 
  {#if flagLoading}
  <div class="flex items-center text-center justify-center w-full">
    
    <br>
    <p class="text-lg text-purple-700 font-bold">Extracting... &nbsp</p>
    <Spinner color="purple" />
  </div>

  
    {:else}
    <TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={searchTerm}>
      <TableHead>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Birthday</TableHeadCell>
        <TableHeadCell>Desired position</TableHeadCell>
        <TableHeadCell>Phone Number</TableHeadCell>
        <TableHeadCell>Email</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        {#each filteredItems as item}
          <TableBodyRow>
            <TableBodyCell>{item.id}</TableBodyCell>
            <TableBodyCell>{item.Name}</TableBodyCell>
            <TableBodyCell>{item.Birthday}</TableBodyCell>
            <TableBodyCell>{item.DrPosition}</TableBodyCell>
            <TableBodyCell>{item.Phone}</TableBodyCell>
            <TableBodyCell>{item.Email}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableSearch>
  {/if}

  <svelte:fragment slot='footer'>
    <Button on:click={handleDownload} disabled={flagLoading}>Download</Button>
    <Button color="alternative" on:click={()=>{upload_files=[]}} >Decline</Button>
  </svelte:fragment>
</Modal>





<BottomNav position="absolute" navType="application" classInner="grid-cols-3" outerClass='w-1/2'>
  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Home" appBtnPosition="left" on:click={handleExtraction}>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABiklEQVR4nO2WwUrDQBCGv75ET9oepAhefQJrX8CH8E3qYyg9Fq3ebLX11JBbb76DoEWwendlYAJDSJrdZBHE/jBkdzLs/Jt/ZjewQxw8AU5twS+ja5Jn1mmyYBtYFSxaZAlwpuMHNac+QQs4B26BQ9/kz57J7SeX54WajOfAwLwTe6ki0TbJLYkyWBLfwAnQ17F992rWm2wjsDLJ2wEELoFj45fxCPgCxsAR8KaxIofXjlwAgSqMjVStUAJLj/ieFtmn2p3RuqVfQuJOq5g6zx3l49cFxN+BPY0bqe9Ru6PrQyCtaD0bL3avCcWm6rs2NZEvzEUVgWQLgUwW68t2K9hX38b4pEOG5pxwMSVwJQQ+jK8fSiANlGCqicVmuZ4vkmAeU4J1SRFKd9QuQh9k8QfAjWq+0Z33Ctpw4LtgqATRD6JQCa5iH8W+iH4ZuZo21+ew6XWc1Ei+9Pwhmfj+kNRBp4CYnAfBSE2Fh84XVYeMD1yuCEPnjZHk7v/Q+d9H2qAGosDtauBf4geYeFfVSi4HXQAAAABJRU5ErkJggg==" alt="">
        <Tooltip arrow={true}>Extract</Tooltip>
    </BottomNavItem>
  </div>
 
  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Create new item" appBtnPosition="middle" btnClass="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary-600 rounded-full hover:bg-primary-700 group focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800" on:click={() => defaultModal = true}>
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
        </svg>
      <Tooltip arrow={false}>Upload JD</Tooltip>
    </BottomNavItem>
  </div>

  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Profile" appBtnPosition="right" on:click={handleDelete}>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO3VwQnCMBjF8Qe6hnYRO4FSPNcJ9FxBF9AJdAKdQCcwE9gJdAOPFaFKoFfBvPdJEPuH3JLvR3IJ0PZ5YwAZInQHUH1reNYMfwauin0NR2DvlosFn5ib/1c3g2f2M4IrDeAzAx8N4AMDbw3gDQMvDeAFA08M4JyBUwN4wMB9A7jHwB0ADwH1Z7sguwrwBUIu1uewF+CdAq8FeKXAMwGeKvBIgIcKnACoCbRuzkrNA/9mv7dQ0bbf7wXRGEWDOGx/GAAAAABJRU5ErkJggg=="  alt="">
        <Tooltip arrow={false}>Delete all</Tooltip>
    </BottomNavItem>
  </div>

  
</BottomNav>




<!-- <BottomNav position="absolute" navType="application" classInner="grid-cols-3" defaultClass='w-1/4'>
  <BottomNavItem btnName="Home" appBtnPosition="left" on:click={handleExtraction}>
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

  <BottomNavItem btnName="Profile" appBtnPosition="right" on:click={handleDelete}>
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO3VwQnCMBjF8Qe6hnYRO4FSPNcJ9FxBF9AJdAKdQCcwE9gJdAOPFaFKoFfBvPdJEPuH3JLvR3IJ0PZ5YwAZInQHUH1reNYMfwauin0NR2DvlosFn5ib/1c3g2f2M4IrDeAzAx8N4AMDbw3gDQMvDeAFA08M4JyBUwN4wMB9A7jHwB0ADwH1Z7sguwrwBUIu1uewF+CdAq8FeKXAMwGeKvBIgIcKnACoCbRuzkrNA/9mv7dQ0bbf7wXRGEWDOGx/GAAAAABJRU5ErkJggg=="  alt="">
      <Tooltip arrow={false}>Delete all</Tooltip>
  </BottomNavItem>
</BottomNav> -->


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