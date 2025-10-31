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
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        Map<String, Object> responseBody = new HashMap<>();
        Map<String, Object> response = new HashMap<>();

        try {
            // Defensive logging
            context.getLogger().log("Received event: " + mapper.writeValueAsString(input));

            Map<String, String> pathParameters = (Map<String, String>) input.get("pathParameters");
            String productId = (pathParameters != null) ? pathParameters.get("productId") : null;

            Map<String, String> queryParameters = (Map<String, String>) input.get("queryStringParameters");
            String shopId = (queryParameters != null) ? queryParameters.get("shopId") : null;

            if (productId == null || productId.isEmpty()) {
                responseBody.put("error", "Missing path parameter: productId");
                return createResponse(400, responseBody);
            }
            if (shopId == null || shopId.isEmpty()) {
                responseBody.put("error", "Missing query parameter: shopId");
                return createResponse(400, responseBody);
            }

            Map<String, AttributeValue> key = new HashMap<>();
            key.put("ShopId", AttributeValue.builder().s(shopId).build()); // Partition key
            key.put("ItemId", AttributeValue.builder().s(productId).build()); // Sort key

            DeleteItemRequest deleteRequest = DeleteItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .key(key)
                    .build();

            context.getLogger().log("EVENT: " + mapper.writeValueAsString(input));
            context.getLogger().log("PathParameters: " + pathParameters);
            context.getLogger().log("QueryParameters: " + queryParameters);

            dynamoDb.deleteItem(deleteRequest);

            responseBody.put("message", "Product deleted successfully");
            return createResponse(200, responseBody);
        } catch (Exception e) {
            context.getLogger().log("Error deleting product: " + e.getMessage());
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

