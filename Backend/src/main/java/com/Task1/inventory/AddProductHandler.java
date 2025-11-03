package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.Map;

public class AddProductHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;
    private static final ObjectMapper mapper = new ObjectMapper();

    public AddProductHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        String httpMethod = (String) input.get("httpMethod");
        if ("OPTIONS".equalsIgnoreCase(httpMethod)) {
            context.getLogger().log("Received OPTIONS request");
            return createResponse(200, Map.of());
        }

        Map<String, Object> responseBody = new HashMap<>();

        try {
            String bodyJson = (String) input.get("body");
            if (bodyJson == null) {
                responseBody.put("error", "Missing request body");
                return createResponse(400, responseBody);
            }

            Map<String, Object> body = mapper.readValue(bodyJson, Map.class);

            String shopId = (String) body.get("shopId");
            String productId = (String) body.get("productId");  // This is your ItemId (sort key)
            String productName = (String) body.get("productName");
            Integer stockLevel = null;

            Object stockLevelObj = body.get("stockLevel");
            if (stockLevelObj instanceof Integer) {
                stockLevel = (Integer) stockLevelObj;
            } else if (stockLevelObj instanceof String) {
                stockLevel = Integer.parseInt((String) stockLevelObj);
            } else {
                stockLevel = 0;
            }

            if (shopId == null || productId == null || productName == null) {
                responseBody.put("error", "Missing required parameters: shopId, productId, productName");
                return createResponse(400, responseBody);
            }

            Map<String, AttributeValue> item = new HashMap<>();
            item.put("ShopId", AttributeValue.builder().s(shopId).build());      // Partition key
            item.put("ItemId", AttributeValue.builder().s(productId).build());   // Sort key
            item.put("ProductName", AttributeValue.builder().s(productName).build());
            item.put("StockLevel", AttributeValue.builder().n(stockLevel.toString()).build());

            PutItemRequest putRequest = PutItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .item(item)
                    .build();

            dynamoDb.putItem(putRequest);

            responseBody.put("message", "Product added successfully");
            return createResponse(200, responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error in AddProductHandler: " + e.getMessage());
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
