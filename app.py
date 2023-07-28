from typing import Annotated

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173",  # Add the exact URL of your Svelte app
    "http://127.0.0.1:5173",  # Add the exact URL of your Svelte app

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/files/")
async def create_files(files: Annotated[list[bytes], File()]):
    return {"file_sizes": [len(file) for file in files]}


@app.post("/uploadfiles/")
async def upload_files(files: List[UploadFile]= File(...),name:str= Form(...), link:str= Form(...) ):
    # File upload processing logic here
    # For example, you can save the files, perform some operations, etc.

    # Replace the following line with your desired processing logic:
    for file in files:
        print(file.filename)
    return JSONResponse(content={"message": "Files uploaded successfully"}, status_code=201)