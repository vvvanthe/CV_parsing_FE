<script>
  import { Card, Button, Avatar,Modal ,GradientButton,Input } from "flowbite-svelte";
  import { Fileupload, Label, Listgroup, ListgroupItem,Spinner, Toast,Img,CloseButton  } from 'flowbite-svelte'
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import axios from "axios";
  import { BottomNav, BottomNavItem,Tooltip } from "flowbite-svelte"
  import pdf_logo from '$lib/images/r.png';
  import { onMount, afterUpdate  } from "svelte";
  import logo from '$lib/images/aivision.png';

  let temp
  
  let cv_files=[]
  let defaultModal = false;
  let extractionModal=false;
  let singleCVModal = false;
  let flagLoading = false;
  let upload_files=[]
  let load_extractiontable=[]
  let singleCV
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
      // console.log("Server Response:", response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle the error
    }

    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_cvpdflist');
		  temp = await response2.json();
      cv_files = await temp.data;
    } catch (error) {
      console.error("Error fetching data:", error);
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

    // try {
    //   const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/cv_score');
    //   flagLoading = false

    // } catch (error) {
    //   flagLoading = false
    //   console.error("Error fetching data:", error);
    // }

    try {
      const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_extractshort');
      
      temp = await response2.json();
      load_extractiontable = await temp.data;
      flagLoading = false
 

    } catch (error) {

      flagLoading = false
      console.error("Error fetching data:", error);
    }   
  }

  async function handleClickRow(cv_filename){
    // console.log(cv_filename)


    let formData = {
      cv_file : cv_filename,

  };

    
    try {
      const response = await axios.post("https://cvscreenbe.ap.ngrok.io/api/load_extract", new URLSearchParams(formData).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        maxRedirects: 0, // Disable redirects
      });
      console.log("Server Response:", response.data);
      singleCV = await response.data.data
      // Handle the response data as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle the error
    }


    singleCVModal = true
    extractionModal = false

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


  $: simplifiedData =load_extractiontable.map((item, index) => ({ id: index+1, Name: item.name, Birthday:item.birthday,DrPosition:item.desired_position, Gender:item.gender,Nationality:item.nationality, Filename:item.cv_filename}))

  


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
    // try {
    //   const response2 = await fetch('https://cvscreenbe.ap.ngrok.io/api/load_cvpdflist');
		//   temp = await response2.json();
    //   cv_files = await temp.data;
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
   
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
        <TableHeadCell>Gender</TableHeadCell>
        <TableHeadCell>Nationality</TableHeadCell>
      </TableHead>
      <TableBody >
        {#each filteredItems as item}
          <TableBodyRow on:click={()=>handleClickRow(item.Filename)} class='cursor-pointer'>
            <TableBodyCell>{item.id}</TableBodyCell>
            <TableBodyCell>{item.Name}</TableBodyCell>
            <TableBodyCell>{item.Birthday}</TableBodyCell>
            <TableBodyCell>{item.DrPosition}</TableBodyCell>
            <TableBodyCell>{item.Gender}</TableBodyCell>
            <TableBodyCell>{item.Nationality}</TableBodyCell>
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




<Modal title="Single CV" bind:open={singleCVModal} autoclose size='xl'>

         <div class="flex justify-center content-center ">
          <div class="border border-gray-300 rounded-sm shadow-lg py-10 px-10 w-5/6 mt-10 mb-10">
            <header>
              <!-- social icons-->
              <ul class="flex flex-wrap justify-end gap-2">
                  <!-- linkedin -->
                  <li>
                      <a href={singleCV.contact_information.urls.facebook}
                          class="bg-blue-600 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded"
                          target=”_blank”>
                          <svg class="w-5 h-5 fill-current" role="img" viewBox="0 0 256 256"
                              xmlns="http://www.w3.org/2000/svg">
                              <g>
                                  <path
                                      d="M218.123122,218.127392 L180.191928,218.127392 L180.191928,158.724263 C180.191928,144.559023 179.939053,126.323993 160.463756,126.323993 C140.707926,126.323993 137.685284,141.757585 137.685284,157.692986 L137.685284,218.123441 L99.7540894,218.123441 L99.7540894,95.9665207 L136.168036,95.9665207 L136.168036,112.660562 L136.677736,112.660562 C144.102746,99.9650027 157.908637,92.3824528 172.605689,92.9280076 C211.050535,92.9280076 218.138927,118.216023 218.138927,151.114151 L218.123122,218.127392 Z M56.9550587,79.2685282 C44.7981969,79.2707099 34.9413443,69.4171797 34.9391618,57.260052 C34.93698,45.1029244 44.7902948,35.2458562 56.9471566,35.2436736 C69.1040185,35.2414916 78.9608713,45.0950217 78.963054,57.2521493 C78.9641017,63.090208 76.6459976,68.6895714 72.5186979,72.8184433 C68.3913982,76.9473153 62.7929898,79.26748 56.9550587,79.2685282 M75.9206558,218.127392 L37.94995,218.127392 L37.94995,95.9665207 L75.9206558,95.9665207 L75.9206558,218.127392 Z M237.033403,0.0182577091 L18.8895249,0.0182577091 C8.57959469,-0.0980923971 0.124827038,8.16056231 -0.001,18.4706066 L-0.001,237.524091 C0.120519052,247.839103 8.57460631,256.105934 18.8895249,255.9977 L237.033403,255.9977 C247.368728,256.125818 255.855922,247.859464 255.999,237.524091 L255.999,18.4548016 C255.851624,8.12438979 247.363742,-0.133792868 237.033403,0.000790807055">
                                  </path>
                              </g>
                          </svg>
                      </a>
                  </li>
                  <li>
                      <!-- github -->
                      <a href="https://github.com/"
                          class="bg-gray-700 p-2 font-medium text-white inline-flex items-center space-x-2 rounded"
                          target=”_blank”>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true" role="img" class="w-5" preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24">
                              <g fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                                      fill="currentColor" />
                              </g>
                          </svg>
                      </a>
                  </li>
                  
              </ul>
              <div class="flex justify-between items-center">
                  <div>
                      <div class="bg-cover bg-no-repeat rounded-full h-52 w-52"
                          style="background-image: url(../bootstrap/dog.jpg)">
                          <img class="w-1/2" src={logo} alt="">
                      </div>
                  </div>
                  <div class="grid justify-items-end">
                      <h1 class="text-7xl font-extrabold">{singleCV.personal_information.name}</h1>
                      <p class="text-xl mt-5">{singleCV.personal_information.desired_position}</p>
                  </div>
              </div>
          </header>


           <!-- detailed info -->
        <main class="flex gap-x-10 mt-10">
            <div class="w-2/6">
                <!-- contact details -->
                <strong class="text-xl font-medium">Contact Details</strong>
                <ul class="mt-2 mb-10">
                    <li class="px-2 mt-1"><strong class="mr-1">Phone </strong>
                        <p class="block">{singleCV.contact_information.phone||'N/A'}</p>
                    </li>
                    <li class="px-2 mt-1"><strong class="mr-1">E-mail </strong>
                        <a href="mailto:" class="block">{singleCV.contact_information.email||'N/A'}</a>
                    </li>
                    <li class="px-2 mt-1"><strong class="mr-1">Location</strong><span class="block">{singleCV.contact_information.address||'N/A'}</span></li>
                </ul>

                <!-- github stats -->
                <!-- <strong class="text-xl font-medium ">Github Stats</strong>
                <ul class="flex w-full mt-2 mb-10">
                    <li class="px-2 mt-2 w-4/12 bg-pink-600 text-white text-center rounded-tl-lg rounded-bl-lg">HTML
                    </li>
                    <li class="px-2 mt-2 w-4/12 bg-blue-600 text-white text-center">CSS</li>
                    <li class="px-2 mt-2 w-5/12 bg-yellow-500 text-white text-center rounded-tr-lg rounded-br-lg">JS
                    </li>

                </ul> -->
                <!-- skills -->
                <strong class="text-xl font-medium">Skills</strong>
                <ul class="mt-2 mb-10">
                  {#if singleCV.skills.spoken_language!=='N/A'}
                  <li class="px-2 mt-1 text-sm">{singleCV.skills.spoken_language||'N/A'}</li>
                  {/if}  
                  {#if singleCV.skills.spoken_language==='N/A' && singleCV.skills.soft_skill!=='N/A'}
                  <li class="px-2 mt-1 text-sm">{singleCV.skills.soft_skill||'N/A'}</li>
                  {/if}  
                  {#if singleCV.skills.spoken_language==='N/A' && singleCV.skills.soft_skill==='N/A'}
                  <li class="px-2 mt-1 text-sm" >{'N/A'}</li>
                  {/if}
                  
                  

                    <!-- <li class="px-2 mt-1">CSS</li>
                    <li class="px-2 mt-1">JavaScript</li>
                    <li class="px-2 mt-1">React</li>
                    <li class="px-2 mt-1">Node.js</li> -->
                </ul>
                <strong class="text-xl font-medium">Programming Language</strong>
                <ul class="mt-2 mb-10">
                  <li class="px-2 mt-1 text-sm">{singleCV.skills.programming_language||'N/A'}</li>
                </ul>
      
                <!-- what I'm learning these days -->
                <strong class="text-xl font-medium">Certificates</strong>
                <ul class="mt-2 mb-10">

                  {#if singleCV.certificates.language_certificates!=='N/A'}
                  <li class="px-2 mt-1 text-sm">{singleCV.certificates.language_certificates||'N/A'}</li>
                  {/if}  
                  {#if singleCV.certificates.language_certificates==='N/A' && singleCV.certificates.other_certificates!=='N/A'}
                  <li class="px-2 mt-1 text-sm">{singleCV.certificates.other_certificates||'N/A'}</li>
                  {/if}  
                  {#if singleCV.certificates.language_certificates==='N/A' && singleCV.certificates.other_certificates==='N/A'}
                  <li class="px-2 mt-1 text-sm">{'N/A'}</li>
                  {/if}  

                </ul>
                <strong class="text-xl font-medium">Achievements & Honor</strong>
                <ul class="mt-2">
                    <li class="px-2 mt-1 text-sm">{singleCV.achievements_and_honors||'N/A'}</li>

                </ul>
            </div>
            <!-- info -->
            <div class="w-4/6">
              <section>
                  <!-- about me -->
                  <!-- <h2 class="text-2xl pb-1 border-b font-semibold">About</h2>
                  <p class="mt-4 text-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus
                      deserunt modi qui. Dolorum aliquid quasi velit cupiditate officia magnam impedit, sapiente
                      hic, eaque quaerat ullam fugiat reprehenderit voluptates odit! Error.
                      Tempore fuga iusto eveniet omnis impedit repellat ab repellendus nesciunt similique. Iure
                      voluptates, enim nesciunt tempora amet earum, porro rem ad et sequi corrupti neque quidem?
                      Debitis quo quibusdam nemo.
                      Nam doloremque perferendis tempora asperiores, ullam praesentium et, voluptas pariatur illo
                      aliquid similique, fugiat repellendus ipsa necessitatibus minus hic culpa quasi. Sed
                      voluptate itaque accusantium earum cupiditate ipsa neque magnam!</p> -->

              </section>
              {#if singleCV.projects.length>0}
              <section>
                  <!-- projects -->
                 
                  <h2 class="text-2xl mt-6 pb-1 border-b font-semibold">Projects</h2>
                  <ul class="mt-1">
                    {#each singleCV.projects as project}
                    <li class="py-2">
                      <!-- <div class="flex justify-between my-1">
                          <strong>{project.project_name}</strong>
                          <p class="flex">
                              <span class="bg-gray-600 text-white px-2 py-1 ml-1 text-xs rounded">{project.time}</span>
                          </p>
                      </div> -->
                      <p class="flex justify-between text-sm"><strong class="text-base">{project.project_name}</strong>{project.time}</p>
                     
                      <p class="text-xs">- Number of member: {project.time}</p>
                      <p class="text-xs">- Technologies: {project.used_technologies}</p>

                  </li>
                    {/each}

                  </ul>
              </section>
              {/if}
              {#if singleCV.work_experiences.length>0}
              <section>
                  <!-- work experiences -->
                  <h2 class="text-2xl mt-6 pb-1 border-b font-semibold">Work Experiences</h2>
                  <ul class="mt-2">
                        
                    {#each singleCV.work_experiences as company}
                    <li class="pt-2">
                      <p class="flex justify-between text-sm"><strong class="text-base">{company.company_name}</strong>{company.time}</p>
                      <p class="flex justify-between text-base">{company.position}<small>{company.domain}</small></p>
                      <p class="text-justify text-xs">
                        {company.job_descriptions}
                      </p>
                      <p class="text-justify text-xs">Technologies: {company.used_technologies}
                      </p>
                  </li>

                    {/each}


                  </ul>
              </section>
              {/if}
              {#if singleCV.education.length>0}
              <section>
                  <!-- education -->
                  <h2 class="text-2xl mt-6 pb-1 border-b font-semibold">Education</h2>
                  <ul class="mt-2">
                    {#each singleCV.education as edu}
                    <li class="pt-2">
                      <p class="flex justify-between text-sm"><strong class="text-base">{edu.institution_name}</strong>{edu.time}</p>
                      <p class="flex justify-between text-sm">{edu.degree} : {edu.major}<small>GPA {edu.gpa}</small></p>
                  </li>
                    {/each}
                      
                      
                  </ul>
              </section>
              {/if}
          </div>
      </main>

          
          </div>


         </div>



   <svelte:fragment slot='footer'>
    <Button color="yellow"  on:click={()=>{extractionModal=true}}>Back</Button>
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