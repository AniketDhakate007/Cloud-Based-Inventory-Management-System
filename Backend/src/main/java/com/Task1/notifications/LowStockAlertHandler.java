package com.Task1.notifications;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import java.util.List;
import java.util.Map;

public class LowStockAlertHandler implements RequestHandler<Map<String, Object>, String> {

    private static final String TABLE_NAME = "InventoryDB";
    private final DynamoDbClient dynamoDb;

    public LowStockAlertHandler() {
        this.dynamoDb = DynamoDbClient.builder()
                .region(Region.EU_NORTH_1)
                .build();
    }

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        int threshold = 10; // Example low stock threshold
        StringBuilder alerts = new StringBuilder();

        ScanRequest scanRequest = ScanRequest.builder().tableName(TABLE_NAME).build();
        ScanResponse response = dynamoDb.scan(scanRequest);

        for (Map<String, AttributeValue> item : response.items()) {
            AttributeValue stockAttr = item.get("StockLevel");
            if (stockAttr != null && Integer.parseInt(stockAttr.n()) < threshold) {
                String productName = item.get("ProductName").s();
                alerts.append("Low stock alert for ").append(productName).append("\n");

                //sns
            }
        }
        return alerts.length() > 0 ? alerts.toString() : "No low stock products.";
    }
}
