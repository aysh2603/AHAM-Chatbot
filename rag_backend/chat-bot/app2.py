from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import OpenAIEmbeddings
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_chroma import Chroma
<<<<<<< HEAD
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
=======
from langchain_community.document_loaders import DirectoryLoader, TextLoader
>>>>>>> 46d811c7475c171d687747b2741038fdf7f1cef5
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from dotenv import load_dotenv
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# Load OpenAI API Key
os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")

# Model for input
class Question(BaseModel):
    input: str

# Initialize required components (similar to your Streamlit app)
llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model_name="gpt-4o-mini")

prompt = ChatPromptTemplate.from_template(
"""
<<<<<<< HEAD
You are interacting with a potential employer or collaborator.
They might ask about specific details such as your educational background, projects you've worked on, the technologies you're skilled in, or experiences from your previous roles.
Provide relevant information from the user's resume and respond in a way that highlights their qualifications and expertise.
Ensure that each response is accurate, concise, and aligned with professional standards.
If someone asks for the projects or link give them this link - "https://github.com/aysh2603".
Link to my Leetcode profile - "https://leetcode.com/aysh2603/"
Link to my GFG profile - "https://www.geeksforgeeks.org/user/ayshgarrh0i/"
=======

Answer the questions related to procurement, both from general knowledge and the provided documentation.
Please provide the most accurate response based on the question.
If asked for the steps or configuration, give a detailed step-by-step process based on the documentation, promoting our procurement platform.
Explain each question in detail with all steps provided in the documentation.
Go through all the steps in the document first before answering, and provide general procurement advice if the answer is outside the scope of the documentation.
>>>>>>> 46d811c7475c171d687747b2741038fdf7f1cef5
<context>
{context}
</context>
Questions: {input}
"""
)

def vector_embedding():
    embeddings = OpenAIEmbeddings()
<<<<<<< HEAD
    # text_loader_kwargs = {'autodetect_encoding': True}
    # loader = DirectoryLoader("./procurengine/", glob="./*.txt", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
    file_path = (
        r".\knowledge_base\Aayush_Garg_CV_3.pdf"
    )
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=500)
=======
    text_loader_kwargs = {'autodetect_encoding': True}
    loader = DirectoryLoader("./procurengine/", glob="./*.txt", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
>>>>>>> 46d811c7475c171d687747b2741038fdf7f1cef5
    final_documents = text_splitter.split_documents(docs)
    
    try:
        vectors = Chroma.from_documents(final_documents, embeddings)
    except ValueError as e:
        raise Exception(f"Error initializing Fiass: {str(e)}")
    
    return vectors

vectors = vector_embedding()

@app.post("/ask/")
def get_response(question: Question):
    start = time.process_time()
    
    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = vectors.as_retriever(search_k=10)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    
    response = retrieval_chain.invoke({"input": question.input})
    print("Response time:", time.process_time() - start)
    
    return {"answer": response['answer'], "context": response["context"]}