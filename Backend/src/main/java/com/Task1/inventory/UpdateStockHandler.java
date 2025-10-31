package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

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
        Map<String, Object> responseBody = new HashMap<>();
        Map<String, Object> response = new HashMap<>();

        try {
            String bodyJson = (String) input.get("body");
            if (bodyJson == null) {
                responseBody.put("error", "Missing request body");
                return createResponse(400, responseBody);
            }

            Map<String, Object> body = mapper.readValue(bodyJson, Map.class);

            String shopId = (String) body.get("shopId");
            String productId = (String) body.get("productId"); // sort key ItemId
            Integer stockLevel = null;

            Object stockLevelObj = body.get("stockLevel");
            if (stockLevelObj instanceof Integer) {
                stockLevel = (Integer) stockLevelObj;
            } else if (stockLevelObj instanceof String) {
                stockLevel = Integer.parseInt((String) stockLevelObj);
            } else {
                responseBody.put("error", "Invalid stockLevel value");
                return createResponse(400, responseBody);
            }

            if (shopId == null || productId == null || stockLevel == null) {
                responseBody.put("error", "Missing required parameters: shopId, productId, stockLevel");
                return createResponse(400, responseBody);
            }

            Map<String, AttributeValue> key = new HashMap<>();
            key.put("ShopId", AttributeValue.builder().s(shopId).build());
            key.put("ItemId", AttributeValue.builder().s(productId).build());

            String updateExpression = "SET StockLevel = :stockLevelVal";
            Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
            expressionAttributeValues.put(":stockLevelVal", AttributeValue.builder().n(stockLevel.toString()).build());

            UpdateItemRequest updateRequest = UpdateItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .key(key)
                    .updateExpression(updateExpression)
                    .expressionAttributeValues(expressionAttributeValues)
                    .build();

            dynamoDb.updateItem(updateRequest);

            responseBody.put("message", "Stock level updated successfully");
            return createResponse(200, responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error updating stock: " + e.getMessage());
            responseBody.put("error", e.getMessage());
            return createResponse(500, responseBody);
        }
    }

    private Map<String, Object> createResponse(int statusCode, Map<String, Object> bodyMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("statusCode", statusCode);
            response.put("body", mapper.writeValueAsString(bodyMap));
        } catch (Exception e) {
            response.put("statusCode", 500);
            response.put("body", "{\"error\":\"Failed to serialize response\"}");
        }
        return response;
    }
}
