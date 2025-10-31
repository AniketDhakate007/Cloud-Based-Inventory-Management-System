package com.Task1.sales;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

import java.util.HashMap;
import java.util.Map;

public class RecordSaleHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;

    public RecordSaleHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        String shopId = (String) input.get("shopId");
        String productId = (String) input.get("productId");
        Integer quantitySold = (Integer) input.get("quantitySold");

        // Fetch current stock then update after sale
        // For simplicity, assuming stock exists and update directly
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("ShopID", AttributeValue.builder().s(shopId).build());
        key.put("SK", AttributeValue.builder().s("PRODUCT#" + productId).build());

        // Decrease stock: "SET StockLevel = StockLevel - :q"
        Map<String, String> exprAttrNames = new HashMap<>();
        exprAttrNames.put("#SL", "StockLevel");

        Map<String, AttributeValue> exprAttrValues = new HashMap<>();
        exprAttrValues.put(":q", AttributeValue.builder().n(quantitySold.toString()).build());

        UpdateItemRequest updateRequest = UpdateItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(key)
                .updateExpression("SET #SL = #SL - :q")
                .expressionAttributeNames(exprAttrNames)
                .expressionAttributeValues(exprAttrValues)
                .build();

        dynamoDb.updateItem(updateRequest);
        return "Sale recorded and stock updated.";
    }
}
