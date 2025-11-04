package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DeleteItemRequest;

import java.util.HashMap;
import java.util.Map;

public class DeleteProductHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;
    private static final ObjectMapper mapper = new ObjectMapper();

    public DeleteProductHandler() {
        this.dynamoDb = DynamoDbClient.builder().region(Region.EU_NORTH_1).build();
    }

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        String httpMethod = (String) input.get("httpMethod");
        if ("OPTIONS".equalsIgnoreCase(httpMethod)) {
            return createResponse(200, Map.of());
        }

        Map<String, Object> responseBody = new HashMap<>();
        try {
            // Extract productId from path parameters
            String productId = null;
            if (input.containsKey("pathParameters")) {
                Map<String, String> pathParams = (Map<String, String>) input.get("pathParameters");
                productId = pathParams.get("productId");
            }

            // Extract shopId from query params or body
            String shopId = null;
            if (input.containsKey("queryStringParameters")) {
                Map<String, String> queryParams = (Map<String, String>) input.get("queryStringParameters");
                shopId = queryParams.get("shopId");
            }
            // Fallback: If not found in query, try JSON body
            if (shopId == null && input.containsKey("body")) {
                String bodyJson = (String)input.get("body");
                if (bodyJson != null && !bodyJson.isEmpty()) {
                    Map<String, Object> body = mapper.readValue(bodyJson, Map.class);
                    shopId = (String)body.get("shopId");
                }
            }

            if (productId == null || shopId == null) {
                responseBody.put("error", "Missing productId (path) or shopId (query/body)");
                return createResponse(400, responseBody);
            }

            Map<String, AttributeValue> key = new HashMap<>();
            key.put("ShopId", AttributeValue.builder().s(shopId).build());
            key.put("ItemId", AttributeValue.builder().s(productId).build());

            DeleteItemRequest delReq = DeleteItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .key(key)
                    .build();

            dynamoDb.deleteItem(delReq);

            responseBody.put("message", "Product deleted successfully");
            return createResponse(200, responseBody);

        } catch (Exception e) {
            responseBody.put("error", e.getMessage());
            return createResponse(500, responseBody);
        }
    }

    private Map<String, Object> createResponse(int statusCode, Map<String, Object> bodyMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("statusCode", statusCode);
            response.put("headers", Map.of(
                    "Access-Control-Allow-Origin", "*",
                    "Access-Control-Allow-Headers", "Content-Type,Authorization",
                    "Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT,DELETE"
            ));
            response.put("body", mapper.writeValueAsString(bodyMap));
        } catch (Exception e) {
            response.put("statusCode", 500);
            response.put("body", "{\"error\":\"Failed to serialize response\"}");
        }
        return response;
    }
}
