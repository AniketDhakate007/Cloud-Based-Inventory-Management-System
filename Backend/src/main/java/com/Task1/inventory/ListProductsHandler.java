package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ListProductsHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;
    private Map<String, Object> convertDynamoItemToMap(Map<String, AttributeValue> item) {
        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, AttributeValue> entry : item.entrySet()) {
            String key = entry.getKey();
            AttributeValue value = entry.getValue();

            if (value.s() != null) {
                result.put(key, value.s());
            } else if (value.n() != null) {
                result.put(key, Integer.parseInt(value.n())); // or Long/Double parsing as needed
            } else if (value.bool() != null) {
                result.put(key, value.bool());
            } else if (value.hasM()) {
                result.put(key, convertDynamoItemToMap(value.m()));
            } else if (value.hasL()) {
                // Handle lists if needed
                // For simplicity, convert list of AttributeValues to List<Object> recursively
            } else {
                result.put(key, null);
            }
        }
        return result;
    }

    private static final ObjectMapper mapper = new ObjectMapper();

    public ListProductsHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        Map<String, Object> response = new HashMap<>();
        try {
            ScanRequest scanRequest = ScanRequest.builder()
                    .tableName(TABLE_NAME)
                    .build();

            ScanResponse scanResponse = dynamoDb.scan(scanRequest);
            // Convert the list of DynamoDB items
            var items = scanResponse.items();
            var simpleItems = new ArrayList<Map<String, Object>>();
            for (Map<String, AttributeValue> item : items) {
                simpleItems.add(convertDynamoItemToMap(item));
            }

            String responseBody = mapper.writeValueAsString(simpleItems);

            response.put("statusCode", 200);
            response.put("body", responseBody);
        } catch (Exception e) {
            context.getLogger().log("Error listing products: " + e.getMessage());
            response.put("statusCode", 500);
            try {
                response.put("body", mapper.writeValueAsString(Map.of("error", e.getMessage())));
            } catch (Exception ex) {
                response.put("body", "{\"error\":\"Unexpected error\"}");
            }
        }
        return response;
    }
}
