package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ReturnValue;

import java.util.HashMap;
import java.util.Map;

public class UpdateStockHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;
    private static final ObjectMapper mapper = new ObjectMapper();

    public UpdateStockHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        String httpMethod = (String) input.get("httpMethod");

        // Handle CORS preflight request
        if ("OPTIONS".equalsIgnoreCase(httpMethod)) {
            context.getLogger().log("Received OPTIONS preflight request");
            return createResponse(200, Map.of());
        }

        Map<String, Object> responseBody = new HashMap<>();

        try {
            // Extract path parameter productId (ItemId)
            String productId = null;
            if (input.containsKey("pathParameters")) {
                Map<String, String> pathParams = (Map<String, String>) input.get("pathParameters");
                productId = pathParams.get("productId");
            }

            if (productId == null || productId.isEmpty()) {
                responseBody.put("error", "Missing path parameter productId");
                return createResponse(400, responseBody);
            }

            // Parse body
            String bodyJson = (String) input.get("body");
            if (bodyJson == null) {
                responseBody.put("error", "Missing body in request");
                return createResponse(400, responseBody);
            }

            Map<String, Object> body = mapper.readValue(bodyJson, Map.class);

            String shopId = (String) body.get("shopId");  // Partition key
            String productName = (String) body.get("ProductName");
            Integer stockLevel = null;

            Object stockLevelObj = body.get("StockLevel");
            if (stockLevelObj instanceof Integer) {
                stockLevel = (Integer) stockLevelObj;
            } else if (stockLevelObj instanceof String) {
                stockLevel = Integer.parseInt((String) stockLevelObj);
            } else {
                stockLevel = 0;
            }

            if (shopId == null || productName == null) {
                responseBody.put("error", "Missing required fields shopId or ProductName");
                return createResponse(400, responseBody);
            }

            Map<String, AttributeValue> key = new HashMap<>();
            key.put("ShopId", AttributeValue.builder().s(shopId).build());
            key.put("ItemId", AttributeValue.builder().s(productId).build());

            Map<String, String> expressionNames = new HashMap<>();
            expressionNames.put("#name", "ProductName");
            expressionNames.put("#stock", "StockLevel");

            Map<String, AttributeValue> expressionValues = new HashMap<>();
            expressionValues.put(":productName", AttributeValue.builder().s(productName).build());
            expressionValues.put(":stockLevel", AttributeValue.builder().n(stockLevel.toString()).build());

            UpdateItemRequest updateRequest = UpdateItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .key(key)
                    .updateExpression("SET #name = :productName, #stock = :stockLevel")
                    .expressionAttributeNames(expressionNames)
                    .expressionAttributeValues(expressionValues)
                    .returnValues(ReturnValue.ALL_NEW)
                    .build();

            dynamoDb.updateItem(updateRequest);

            responseBody.put("message", "Product updated successfully");
            return createResponse(200, responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error in UpdateStockHandler: " + e.getMessage());
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
