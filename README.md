# AHAM - RAG Chat Application

This repository contains the code for a Retrieval-Augmented Generation (RAG) Chatbot Application. The application leverages a combination of React, FAST API, ChromaDB, and Langchain to provide a seamless and interactive chat experience, augmented with knowledge retrieval capabilities.

## Features

- **Retrieval-Augmented Generation (RAG):** The chat application combines the power of retrieval-based models and generative models to provide accurate and context-aware responses.
- **Knowledge Base Integration:** The app is connected to a knowledge base, enabling it to retrieve relevant information and provide informed answers.
- **Frontend:** Built with React, the user interface is designed to be responsive and user-friendly.
- **Backend:** Powered by FAST API, ensuring fast and efficient API responses.
- **Database:** ChromaDB is used for managing the knowledge base, providing high-performance search and retrieval.
- **Language Processing:** Langchain is integrated for advanced language model capabilities, enabling complex query handling and natural language understanding.

## Setup and Installation

1. Clone the Repository

```bash
  git clone https://github.com/aysh2603/rag_chat_app.git
```
```bash
  cd rag_chat_app
```

2. Add your OPENAI API KEY in .env file

3. Backend Setup

- Navigate to the Backend Directory
```bash
  cd rag_backend
```
```bash
  cd rag_chatbot
```

- Installing the Python dependencies
```bash
  pip install -r requirements.txt
```

- Start the FAST API Server
```bash
  uvicorn app2:app --reload
```

4. Frontend Setup

- Navigate to the Frontend Directory
```bash
  cd rag_frontend
```

- Start the React server
```bash
  npm install
```
```bash
  npm start
```
