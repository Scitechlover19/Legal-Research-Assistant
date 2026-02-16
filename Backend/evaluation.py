import requests
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score

# Test set with multiple IPC-related questions and expected answers
test_set = [
    {"question": "What is the punishment for theft under IPC?", "true_answer": "Punishment for theft under IPC section 379 is up to 3 years or fine or both."},
    {"question": "Explain the punishment for assault?", "true_answer": "Assault under IPC section 351 is punishable with imprisonment up to 3 months or fine or both."},
    {"question": "What is the punishment for voluntarily causing grievous hurt?", "true_answer": "Voluntarily causing grievous hurt under IPC section 325 is punishable with imprisonment up to 7 years and fine."},
    # Add more test cases as needed
]

# Flask API URL for the backend
api_url = "http://localhost:5001/chat"  # Adjust this if your Flask server runs on a different URL or port

# Function to run test cases and evaluate the model
def evaluate_model():
    true_answers = []
    predicted_answers = []

    for test in test_set:
        question = test["question"]
        true_answer = test["true_answer"]
        
        # Send the test case to the Flask API
        response = requests.post(api_url, json={"message": question})
        
        # Parse the response from the API
        if response.status_code == 200:
            api_response = response.json()
            if api_response['success']:
                predicted_answer = api_response['message']
            else:
                predicted_answer = "Error: " + api_response['message']
        else:
            predicted_answer = "Error: Failed to get response from API"
        
        # Store results
        true_answers.append(true_answer)
        predicted_answers.append(predicted_answer)
        
        # Print each result
        print(f"Question: {question}")
        print(f"Expected Answer: {true_answer}")
        print(f"Predicted Answer: {predicted_answer}")
        print("-----")

    # Calculate evaluation metrics based on string matching
    accuracy = sum(1 for true, pred in zip(true_answers, predicted_answers) if true.lower() in pred.lower()) / len(true_answers)
    print(f"\nEvaluation Results:\nAccuracy: {accuracy * 100:.2f}%")

# Run the evaluation
if __name__ == "__main__":
    evaluate_model()
