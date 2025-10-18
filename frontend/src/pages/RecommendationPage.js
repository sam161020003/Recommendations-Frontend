import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// API client to talk to your backend
// Get the backend URL from the environment variable set in Vercel,
// falling back to localhost for local development.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
// Component for a single product card
function ProductCard({ product, onGenerateDescription }) {
  const [newDescription, setNewDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    setIsGenerating(true);
    onGenerateDescription(product.metadata.title, product.metadata.brand)
      .then(desc => {
        setNewDescription(desc);
        setIsGenerating(false);
      })
      .catch(err => {
        setNewDescription("Error generating description.");
        setIsGenerating(false);
      });
  };

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg w-64 flex-shrink-0">
      <img className="w-full h-48 object-cover" src={product.metadata.image_url} alt={product.metadata.title} />
      <div className="p-4">
        <h3 className="font-bold text-md text-cyan-300 truncate">{product.metadata.title}</h3>
        <p className="text-sm text-gray-400">{product.metadata.brand}</p>
        <p className="text-lg font-semibold text-white mt-1">{product.metadata.price}</p>
        {newDescription ? (
          <p className="text-xs text-teal-300 mt-2 bg-gray-800 p-2 rounded">{newDescription}</p>
        ) : (
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="w-full mt-2 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 disabled:bg-gray-500 transition-colors"
          >
            {isGenerating ? 'Generating...' : '✨ Gen AI Description'}
          </button>
        )}
      </div>
    </div>
  );
}


function RecommendationPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! What kind of furniture are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send user query to the /recommend endpoint
      const response = await apiClient.post('/recommend', { query: input });
      const products = response.data.products;

      if (products && products.length > 0) {
        const aiResponse = { sender: 'ai', products: products };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        const aiResponse = { sender: 'ai', text: "I couldn't find any products matching your description. Please try being more specific!" };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const aiResponse = { sender: 'ai', text: 'Sorry, I encountered an error. Please make sure the backend is running and try again.' };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDescription = async (title, brand) => {
    try {
      const response = await apiClient.post('/generate-description', {
        product_title: title,
        product_brand: brand,
      });
      return response.data.description;
    } catch (error) {
      console.error("Error generating description:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-white'}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.products && (
                  <div>
                    <p className="mb-3">I found these products for you:</p>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                      {msg.products.map(product => (
                        <ProductCard key={product.id} product={product} onGenerateDescription={handleGenerateDescription} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="rounded-lg px-4 py-2 bg-gray-700 text-white">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Area */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'a modern wooden coffee table'"
            className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-r-lg hover:bg-cyan-500 disabled:bg-gray-500 transition-colors"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecommendationPage;