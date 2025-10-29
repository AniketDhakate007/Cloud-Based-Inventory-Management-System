package com.Task1.inventory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.Map;

public class AddProductHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;

    public AddProductHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        String shopId = (String) input.get("ShopId");
        String productId = (String) input.get("ProductId");
        String productName = (String) input.get("productName");
        Integer stockLevel = (Integer) input.get("stockLevel");

        if (shopId == null || productId == null || productName == null || stockLevel == null) {
            return "Error: Missing required product information";
        }

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("ShopID", AttributeValue.builder().s(shopId).build());
        item.put("SK", AttributeValue.builder().s("PRODUCT#" + productId).build());
        item.put("ProductName", AttributeValue.builder().s(productName).build());
        item.put("StockLevel", AttributeValue.builder().n(stockLevel.toString()).build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(TABLE_NAME)
                .item(item)
                .build();

        dynamoDb.putItem(request);
        return "Product added successfully: " + productId;
    }
}
