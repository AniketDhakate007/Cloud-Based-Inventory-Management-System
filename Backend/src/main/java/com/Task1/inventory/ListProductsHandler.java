package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListProductsHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;
    private final ObjectMapper mapper = new ObjectMapper();

    public ListProductsHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        try {
            var scanRequest = ScanRequest.builder()
                    .tableName(TABLE_NAME)
                    .build();

            var response = dynamoDb.scan(scanRequest);
            return mapper.writeValueAsString(response.items());
        } catch (Exception e) {
            return "Error fetching product list: " + e.getMessage();
        }
    }
}
