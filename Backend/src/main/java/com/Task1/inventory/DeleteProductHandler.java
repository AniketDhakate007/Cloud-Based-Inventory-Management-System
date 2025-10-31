package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DeleteItemRequest;

import java.util.HashMap;
import java.util.Map;

public class DeleteProductHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryTable";
    private final DynamoDbClient dynamoDb;

    public DeleteProductHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.AP_SOUTH_1)  // Set your region here
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        String shopId = (String) input.get("shopId");
        String productId = (String) input.get("productId");

        if (shopId == null || productId == null) {
            return "Error: Missing shopId or productId in request.";
        }

        Map<String, AttributeValue> key = new HashMap<>();
        key.put("ShopID", AttributeValue.builder().s(shopId).build());
        key.put("SK", AttributeValue.builder().s("PRODUCT#" + productId).build());

        DeleteItemRequest deleteRequest = DeleteItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(key)
                .build();

        try {
            dynamoDb.deleteItem(deleteRequest);
            return "Product deleted successfully.";
        } catch (Exception e) {
            context.getLogger().log("Error deleting product: " + e.getMessage());
            return "Error deleting product: " + e.getMessage();
        }
    }
}
