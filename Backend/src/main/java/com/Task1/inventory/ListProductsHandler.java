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
    private static final ObjectMapper mapper = new ObjectMapper();

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
            } else {
                result.put(key, null);
            }
        }
        return result;
    }

    public ListProductsHandler() {
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
        Map<String, Object> response = new HashMap<>();
        try {
            ScanRequest scanRequest = ScanRequest.builder()
                    .tableName(TABLE_NAME)
                    .build();

            ScanResponse scanResponse = dynamoDb.scan(scanRequest);

            var items = scanResponse.items();
            var simpleItems = new ArrayList<Map<String, Object>>();
            for (Map<String, AttributeValue> item : items) {
                simpleItems.add(convertDynamoItemToMap(item));
            }

            String responseBodyString = mapper.writeValueAsString(simpleItems);
            responseBody.put("products", simpleItems);

            // Return success response with CORS headers
            return createResponse(200, responseBody);

        } catch (Exception e) {
            context.getLogger().log("Error listing products: " + e.getMessage());
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
