package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemResponse;

import java.util.HashMap;
import java.util.Map;

public class UpdateStockHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;

    public UpdateStockHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        String shopId = (String) input.get("shopId");
        String productId = (String) input.get("productId");
        Integer newStockLevel = (Integer) input.get("stockLevel");

        if (shopId == null || productId == null || newStockLevel == null) {
            return "Error: Missing required input parameters";
        }

        Map<String, AttributeValue> key = new HashMap<>();
        key.put("ShopID", AttributeValue.builder().s(shopId).build());
        key.put("SK", AttributeValue.builder().s("PRODUCT#" + productId).build());

        Map<String, String> expressionAttributeNames = new HashMap<>();
        expressionAttributeNames.put("#SL", "StockLevel");

        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":newStock", AttributeValue.builder().n(newStockLevel.toString()).build());

        UpdateItemRequest updateRequest = UpdateItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(key)
                .updateExpression("SET #SL = :newStock")
                .expressionAttributeNames(expressionAttributeNames)
                .expressionAttributeValues(expressionAttributeValues)
                .build();

        try {
            UpdateItemResponse response = dynamoDb.updateItem(updateRequest);
            return "Stock updated successfully for product: " + productId;
        } catch (Exception e) {
            context.getLogger().log("Error updating stock: " + e.getMessage());
            return "Error updating stock: " + e.getMessage();
        }
    }
}
