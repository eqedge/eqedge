import { useState, useRef, useEffect } from 'react';
import { useSecret } from '@/contexts/SecretContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Send, Upload, Globe, LogOut, Loader2 } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

export function SecretPanel() {
  const { isSecretPanelOpen, closeSecretPanel, setSecretSessionToken } = useSecret();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [proxyUrl, setProxyUrl] = useState('');
  const [proxyContent, setProxyContent] = useState('');
  const [isProxyLoading, setIsProxyLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('chat');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);

    try {
      const formData = new FormData();
      formData.append('message', inputValue);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('/api/trpc/secret.chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.result?.data?.response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.result.data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProxyRequest = async () => {
    if (!proxyUrl.trim()) return;

    setIsProxyLoading(true);
    try {
      const response = await fetch('/api/trpc/secret.proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: proxyUrl }),
      });

      const data = await response.json();
      if (response.ok && data.result?.data?.content) {
        setProxyContent(data.result.data.content);
      } else {
        setProxyContent('<div style="padding: 20px; color: red;">Failed to load proxy content</div>');
      }
    } catch (error) {
      console.error('Proxy error:', error);
      setProxyContent('<div style="padding: 20px; color: red;">Error loading proxy</div>');
    } finally {
      setIsProxyLoading(false);
    }
  };

  const handleLogout = () => {
    setSecretSessionToken(null);
    closeSecretPanel();
    setMessages([]);
    setProxyContent('');
  };

  if (!isSecretPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-in fade-in">
      <Card className="w-full h-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Secret Panel</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={closeSecretPanel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="chat" className="flex-1">AI Chat</TabsTrigger>
            <TabsTrigger value="proxy" className="flex-1">Web Proxy</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">Welcome to the Secret AI Chat</p>
                    <p className="text-sm">Upload an image or ask a question to get started</p>
                  </div>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="uploaded"
                          className="max-w-full h-auto rounded mb-2"
                        />
                      )}
                      <Streamdown>{msg.content}</Streamdown>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t p-4 space-y-3">
              {selectedImage && (
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="selected"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-sm flex-1">{selectedImage.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Input
                  type="text"
                  placeholder="Ask a question or describe the image..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Proxy Tab */}
          <TabsContent value="proxy" className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b p-4 space-y-2">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter URL to proxy (e.g., https://example.com)"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  disabled={isProxyLoading}
                />
                <Button
                  onClick={handleProxyRequest}
                  disabled={isProxyLoading || !proxyUrl.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProxyLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  Load
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Access any website through this secure proxy
              </p>
            </div>

            {/* Proxy Content */}
            <div className="flex-1 overflow-auto">
              {proxyContent ? (
                <iframe
                  srcDoc={proxyContent}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p>Enter a URL and click Load to view content</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
