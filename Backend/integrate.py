from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain_together import Together
import os
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
TOGETHER_AI_API_KEY = '679426cfb4eaee7a7981a165e1dd796f344aa1d8feb374fbb7157ad1d09ea6be'
os.environ['TOGETHER_AI'] = TOGETHER_AI_API_KEY

# Initialize embeddings and vector store
embeddings = HuggingFaceEmbeddings(
    model_name="nomic-ai/nomic-embed-text-v1",
    model_kwargs={"trust_remote_code": True, "revision": "289f532e14dbbbd5a04753fa58739e9ba766f3c7"}
)

# Load vector database
db = FAISS.load_local("ipc_vector_db", embeddings, allow_dangerous_deserialization=True)
db_retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})

# Prompt template
prompt_template = """<s>[INST]This is a chat template for a Legal Research Assistant specializing in Indian Penal Code queries...
CONTEXT: {context}
CHAT HISTORY: {chat_history}
QUESTION: {question}
ANSWER:
</s>[INST]
"""

prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question', 'chat_history'])

# Initialize LLM
llm = Together(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    temperature=0.5,
    max_tokens=1024,
    together_api_key=TOGETHER_AI_API_KEY
)

# Conversation memory
memory = ConversationBufferWindowMemory(k=2, memory_key="chat_history", return_messages=True)

# Initialize QA chain
qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    memory=memory,
    retriever=db_retriever,
    combine_docs_chain_kwargs={'prompt': prompt}
)

def is_ipc_related(question):
    ipc_keywords = ["ipc", "penal code", "indian penal code", "section", "crime", "offense", "punishment", "law","repercussion","legal"]
    return any(keyword.lower() in question.lower() for keyword in ipc_keywords)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Check if the message is IPC-related
    if is_ipc_related(user_message):
        try:
            # Process the message
            result = qa.invoke(input=user_message)
            
            return jsonify({
                'success': True,
                'message': result['answer']
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
            })
    else:
        return jsonify({
            'success': False,
            'message': "I am designed to answer questions specifically related to the Indian Penal Code (IPC). Please ask an IPC-related question."
        })

@app.route('/reset', methods=['POST'])
def reset_conversation():
    global memory
    memory.clear()
    return jsonify({'success': True, 'message': 'Conversation reset successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)