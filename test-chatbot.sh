#!/bin/bash

# ChatGPT Chatbot Test Script
# This script tests the chatbot API endpoints

echo "🚀 Starting ChatGPT Chatbot Tests..."
echo "=================================="
echo ""

API_BASE="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "${API_BASE}/chat/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 2: Send Message (without conversation ID)
echo -e "${YELLOW}Test 2: Send Message (New Conversation)${NC}"
response=$(curl -s -X POST "${API_BASE}/chat/message" \
    -H "Content-Type: application/json" \
    -d '{
        "message": "Xin chào, tôi muốn thuê xe"
    }')

if echo "$response" | grep -q "response"; then
    echo -e "${GREEN}✅ Message sent successfully${NC}"
    echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
    
    # Extract conversation ID for next test
    conversation_id=$(echo "$response" | jq -r '.conversationId' 2>/dev/null)
    echo ""
    echo "Conversation ID: $conversation_id"
else
    echo -e "${RED}❌ Failed to send message${NC}"
    echo "Response: $response"
fi
echo ""

# Test 3: Send Follow-up Message (with conversation ID)
if [ ! -z "$conversation_id" ] && [ "$conversation_id" != "null" ]; then
    echo -e "${YELLOW}Test 3: Send Follow-up Message${NC}"
    response=$(curl -s -X POST "${API_BASE}/chat/message" \
        -H "Content-Type: application/json" \
        -d "{
            \"message\": \"Tôi cần xe 7 chỗ\",
            \"conversationId\": \"$conversation_id\"
        }")
    
    if echo "$response" | grep -q "response"; then
        echo -e "${GREEN}✅ Follow-up message sent successfully${NC}"
        echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Failed to send follow-up message${NC}"
        echo "Response: $response"
    fi
    echo ""

    # Test 4: Get Conversation History
    echo -e "${YELLOW}Test 4: Get Conversation History${NC}"
    response=$(curl -s "${API_BASE}/chat/conversation/${conversation_id}")
    
    if echo "$response" | grep -q "messages"; then
        echo -e "${GREEN}✅ Conversation history retrieved${NC}"
        echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Failed to get conversation history${NC}"
        echo "Response: $response"
    fi
    echo ""

    # Test 5: Clear Conversation
    echo -e "${YELLOW}Test 5: Clear Conversation${NC}"
    response=$(curl -s -X DELETE "${API_BASE}/chat/conversation/${conversation_id}")
    
    if echo "$response" | grep -q "success"; then
        echo -e "${GREEN}✅ Conversation cleared${NC}"
        echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Failed to clear conversation${NC}"
        echo "Response: $response"
    fi
    echo ""
fi

# Test 6: Error Handling (Empty Message)
echo -e "${YELLOW}Test 6: Error Handling (Empty Message)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/chat/message" \
    -H "Content-Type: application/json" \
    -d '{
        "message": ""
    }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 400 ]; then
    echo -e "${GREEN}✅ Error handling works correctly${NC}"
    echo "Response: $body"
else
    echo -e "${YELLOW}⚠️  Unexpected response (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Summary
echo "=================================="
echo "🎉 Test Suite Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Open browser: http://localhost:5000/chatbot.html"
echo "2. Open Swagger: http://localhost:5000/swagger"
echo "3. Test with frontend component"
echo ""
echo "Note: Make sure to configure OpenAI API key in appsettings.json"
echo "      Some tests may fail if API key is not configured."
